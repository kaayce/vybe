import { Hono } from 'hono'
import { StatusCodes } from 'http-status-codes'
import { TTL, trackedWallets } from '../../lib/constants.js'
import { WalletService } from '../../service/wallet.js'
import { cache } from '../middlelayer/cache.js'
import { serveInternalServerError } from './resp/error.js'
import { serve } from './resp/resp.js'

const walletService = new WalletService()
const walletRouter = new Hono()

walletRouter.use(
  '*',
  cache({
    ttl: TTL.WALLET,
  })
)

// Get SOL balances for all tracked wallets
walletRouter.get('/balances', async (c) => {
  try {
    const walletBalances = await walletService.getWalletBalances(trackedWallets)
    return serve(c, StatusCodes.OK, walletBalances)
  } catch (error) {
    return serveInternalServerError(c, error)
  }
})

export { walletRouter }
