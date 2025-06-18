import { type Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { logger } from '../lib/logger.js'
import { solanaConnection } from '../lib/solana-connection.js'

const log = logger.child({ service: 'WalletService' })

export interface WalletBalance {
  address: string
  balance: number
}

/*
 * Fetches SOL balances for a list of wallet addresses
 * Converts Raw Lamports values to SOL
 * Returns sorted array of WalletBalance objects
 */

export class WalletService {
  private readonly connection: Connection

  constructor() {
    this.connection = solanaConnection
    log.info('WalletService initialized')
  }

  // Fetch SOL balances for a list of wallet addresses
  async getWalletBalances(
    trackedWallets: readonly string[]
  ): Promise<WalletBalance[]> {
    try {
      log.debug(
        { count: trackedWallets.length },
        'Fetching wallet balances (batched)'
      )
      const pubKeys = trackedWallets.map((address) => new PublicKey(address))
      const accounts = await this.connection.getMultipleAccountsInfo(pubKeys)

      const balances: WalletBalance[] = accounts.map((account, i) => ({
        address: trackedWallets[i],
        balance: account ? account.lamports / LAMPORTS_PER_SOL : 0, // Converts lamports to SOL
      }))
      const sorted = balances.toSorted((a, b) => b.balance - a.balance)
      return sorted
    } catch (error) {
      log.error({ error }, 'Failed to fetch wallet balances')
      throw error
    }
  }
}
