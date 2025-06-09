import env from './lib/env.js'

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { showRoutes } from 'hono/dev'
import { logger as httpLogger } from 'hono/logger'
import { trimTrailingSlash } from 'hono/trailing-slash'

import { NODE_ENVIRONMENTS } from './lib/constants.js'
import { logger } from './lib/logger.js'
import { redisConnection } from './lib/redis.js'
import { redisRateLimit } from './web/middlelayer/rateLimit.js'
import { tracing } from './web/middlelayer/tracing.js'
import { Server } from './web/server.js'

const app = new Hono()

app.use(cors())
app.use(tracing)
app.use(compress())
app.use(redisRateLimit())
app.use(httpLogger())
app.use(trimTrailingSlash())

await redisConnection.ping()
logger.info('Redis connection established')

const server = new Server(app)
server.configure()

if (env.NODE_ENV === NODE_ENVIRONMENTS.development) {
  logger.debug('Available routes:')
  showRoutes(app)
}

const port = Number.parseInt(env.PORT)
logger.info(`Server is running on port: ${port}, env: ${env.NODE_ENV}`)
const web = serve({ fetch: app.fetch, port })

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received')

  logger.info('Closing http server')
  web.close(async () => {
    logger.info('Closing redis connection')
    redisConnection.disconnect()

    logger.info('Exiting...👋🏿')
    process.exit(0)
  })
})
