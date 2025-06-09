import type { Context, Next } from 'hono'
import { TTL } from '../../lib/constants.js'
import { logger } from '../../lib/logger.js'
import { redisConnection } from '../../lib/redis.js'

/* Generic cache middleware */

interface CacheOptions {
  ttl?: number
  keyPrefix?: string
}

export const cache = (options: CacheOptions = {}) => {
  const ttl = options.ttl ?? TTL.DEFAULT
  const keyPrefix = options.keyPrefix ?? 'cache:'

  return async (c: Context, next: Next) => {
    const cacheKey = `${keyPrefix}${c.req.path}`
    const log = logger.child({ middleware: 'cache', url: c.req.path })

    try {
      const cached = await redisConnection.get(cacheKey)
      if (cached) {
        log.debug('Cache hit')
        return c.json(JSON.parse(cached))
      }

      log.debug('Cache miss')
      await next()

      if (c.res.ok) {
        const data = await c.res.clone().json()
        await redisConnection.set(cacheKey, JSON.stringify(data), 'EX', ttl)
        log.debug('Cached response')
      }
    } catch (error) {
      log.error({ error }, 'Cache error')
      await next()
    }
  }
}
