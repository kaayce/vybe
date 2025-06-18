import { type Connection, PublicKey } from '@solana/web3.js'
import type { IPriceProvider } from '../interfaces/IPriceProvider.js'
import { logger } from '../lib/logger.js'
import { solanaConnection } from '../lib/solana-connection.js'
import type { TokensDataResponse } from './token.types.js'

const log = logger.child({ service: 'TokenService' })

/**
 * Fetches token data including prices from CoinGecko and token supplies from Solana.
 * Calculates market caps for specified bulish tokens.
 */

export class TokenService {
  private readonly connection: Connection = solanaConnection
  private readonly priceProvider: IPriceProvider

  constructor(priceProvider: IPriceProvider) {
    this.priceProvider = priceProvider
  }

  // Fetch token data from Solana and Price Provider API
  async getTokensData(
    tokens: Record<string, string>
  ): Promise<TokensDataResponse> {
    log.info('Fetching token data for:', Object.keys(tokens))
    const result: TokensDataResponse = {}

    const symbols = Object.keys(tokens)

    const prices = await this.priceProvider.fetchPrices(symbols)

    const supplies = await Promise.all(
      symbols.map(async (symbol) => {
        const mint = new PublicKey(tokens[symbol])
        return {
          symbol,
          supply: await this.fetchSupply(mint),
        }
      })
    )

    for (const { symbol, supply } of supplies) {
      const price = prices[symbol]
      const address = tokens[symbol]

      if (!price) {
        log.warn(
          `Skipping market cap calculation for ${symbol} due to missing price.`
        )
        continue
      }

      result[symbol] = {
        address,
        price,
        supply,
        marketCap: price * supply,
        lastUpdated: Date.now(),
      }
    }

    return result
  }

  // Fetch token supply from Solana
  private async fetchSupply(mint: PublicKey): Promise<number> {
    try {
      const { value } = await this.connection.getTokenSupply(mint)
      const supply = Number(value.amount) / 10 ** value.decimals

      return supply
    } catch (err) {
      log.error({ mint: mint.toString(), error: err }, 'Supply fetch failed')
      throw new Error(`Failed to fetch supply for ${mint}`)
    }
  }
}
