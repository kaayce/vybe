import type { Context, MiddlewareHandler, Next } from 'hono'
import { createMiddleware } from 'hono/factory'
import { StatusCodes } from 'http-status-codes'
import { NODE_ENVIRONMENTS } from '../../lib/constants.js'
import { logger } from '../../lib/logger.js'
import { redisConnection } from '../../lib/redis.js'
import { serveError } from '../controller/resp/error.js'

const log = logger.child({ middleware: 'rate-limit' })

interface RateLimitOptions {
  maxRequests?: number
  windowSeconds?: number
}

interface RateLimitState {
  count: number
  ttl: number
}

class RateLimiter {
  constructor(
    private readonly redis = redisConnection,
    private readonly options: Required<RateLimitOptions> = {
      maxRequests: 15,
      windowSeconds: 1,
    }
  ) {}

  private getClientIp(c: Context): string {
    const forwarded = c.req.header('x-forwarded-for')
    return forwarded
      ? forwarded.split(',')[0].trim()
      : (c.req.header('x-real-ip') ?? 'unknown')
  }

  private async getRateLimitState(ip: string): Promise<RateLimitState> {
    const key = `rate_limit:${ip}`
    const multi = this.redis.multi()

    multi.incr(key)
    multi.ttl(key)

    const results = await multi.exec()
    if (!results) {
      throw new Error('Redis rate limit operation failed')
    }

    const count = results[0][1] as number
    const ttl = results[1][1] as number

    // Set expiration if key is new
    if (ttl === -1) {
      await this.redis.expire(key, this.options.windowSeconds)
    }

    return { count, ttl }
  }

  private setRateLimitHeaders(c: Context, state: RateLimitState): void {
    const { count, ttl } = state
    const { maxRequests } = this.options

    c.header('X-RateLimit-Limit', maxRequests.toString())
    c.header(
      'X-RateLimit-Remaining',
      Math.max(0, maxRequests - count).toString()
    )

    if (ttl > 0) {
      c.header('X-RateLimit-Reset', (Date.now() + ttl * 1000).toString())
    }
  }

  public middleware(): MiddlewareHandler {
    return createMiddleware(async (c: Context, next: Next) => {
      if (c.env?.NODE_ENV === NODE_ENVIRONMENTS.development) {
        return next()
      }

      try {
        const ip = this.getClientIp(c)
        const state = await this.getRateLimitState(ip)
        this.setRateLimitHeaders(c, state)

        if (state.count > this.options.maxRequests) {
          log.warn(
            {
              ip,
              path: c.req.path,
              method: c.req.method,
              count: state.count,
              limit: this.options.maxRequests,
            },
            'Rate limit exceeded'
          )

          return serveError(
            c,
            StatusCodes.TOO_MANY_REQUESTS,
            `Rate limit exceeded. Try again in ${state.ttl} seconds`
          )
        }

        return next()
      } catch (error) {
        log.error({ error }, 'Rate limit middleware error')
        return serveError(
          c,
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Failed to process request'
        )
      }
    })
  }
}

export const redisRateLimit = (
  options?: RateLimitOptions
): MiddlewareHandler => {
  const limiter = new RateLimiter(redisConnection, {
    maxRequests: options?.maxRequests ?? 15,
    windowSeconds: options?.windowSeconds ?? 1,
  })
  return limiter.middleware()
}
