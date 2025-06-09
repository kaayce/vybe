import IORedis from 'ioredis'
import env from './env.js'
import { logger } from './logger.js'

const log = logger.child({ module: 'redis' })

class RedisClient {
  private static instance: IORedis.Redis
  private constructor() {}

  public static getInstance(): IORedis.Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new IORedis.default({
        port: Number.parseInt(env.REDIS_PORT),
        host: env.REDIS_HOST,
        maxRetriesPerRequest: null,
      })
      RedisClient.setupEventHandlers(RedisClient.instance)
    }
    return RedisClient.instance
  }

  private static setupEventHandlers(client: IORedis.Redis): void {
    client.on('connect', () => {
      log.info('Successfully connected to Redis')
    })

    client.on('error', (err) => {
      log.error(err, 'Redis Client Error')
    })

    client.on('reconnecting', (delay: number) => {
      log.warn(`Redis reconnecting in ${delay}ms`)
    })

    client.on('close', () => {
      log.warn('Redis connection closed')
    })
  }
}

export const redisConnection = RedisClient.getInstance()
