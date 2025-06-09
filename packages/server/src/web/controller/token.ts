import { Hono } from 'hono'
import { StatusCodes } from 'http-status-codes'
import { BULLISH_5_TOKENS, TTL } from '../../lib/constants.js'
import { TokenService } from '../../service/token.js'
import { cache } from '../middlelayer/cache.js'
import { serveInternalServerError } from './resp/error.js'
import { serve } from './resp/resp.js'

const tokenService = new TokenService()
const tokenRouter = new Hono()

tokenRouter.use(
  '*',
  cache({
    ttl: TTL.TOKEN,
  })
)

// Get token and market cap data for all tracked tokens
tokenRouter.get('/bullish', async (c) => {
  try {
    const tokenData = await tokenService.getTokensData(BULLISH_5_TOKENS)
    return serve(c, StatusCodes.OK, tokenData)
  } catch (error) {
    return serveInternalServerError(c, error)
  }
})

export { tokenRouter }
