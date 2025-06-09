import { Hono } from 'hono'
import { StatusCodes } from 'http-status-codes'
import { TTL } from '../../lib/constants.js'
import { TPSService } from '../../service/tps.js'
import { cache } from '../middlelayer/cache.js'
import { serveInternalServerError } from './resp/error.js'
import { serve } from './resp/resp.js'

const tpsService = new TPSService()
const metricsRouter = new Hono()

metricsRouter.use(
  '/tps',
  cache({
    ttl: TTL.TPS,
  })
)

// Get historical TPS data
metricsRouter.get('/tps', async (c) => {
  try {
    const duration = Number(c.req.query('duration') ?? '600')
    const tpsHistory = await tpsService.getTPSHistory(duration)
    return serve(c, StatusCodes.OK, tpsHistory)
  } catch (error) {
    return serveInternalServerError(c, error)
  }
})

export { metricsRouter }
