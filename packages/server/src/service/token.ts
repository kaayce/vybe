import { type Connection, PublicKey } from '@solana/web3.js'
import qs from 'qs'
import { symbolToCoinGeckoID } from '../lib/constants.js'
import env from '../lib/env.js'
import { logger } from '../lib/logger.js'
import { request } from '../lib/request.js'
import { solanaConnection } from '../lib/solana-connection.js'
import type {
  CoinGeckoDataResponse,
  TokensDataResponse,
} from './token.types.js'

const log = logger.child({ service: 'TokenService' })

/**
 * Fetches token data including prices from CoinGecko and token supplies from Solana.
 * Calculates market caps for specified bulish tokens.
 */

export class TokenService {
  private readonly connection: Connection = solanaConnection
  private readonly COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

  async getTokensData(
    tokens: Record<string, string>
  ): Promise<TokensDataResponse> {
    log.info('Fetching token data for:', Object.keys(tokens))
    const result: TokensDataResponse = {}

    const symbols = Object.keys(tokens)
    const prices = await this.fetchPrices(symbols)

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

  private async fetchSupply(mint: PublicKey): Promise<number> {
    try {
      const { value } = await this.connection.getTokenSupply(mint)
      const supply = Number(value.amount) / 10 ** value.decimals

      return supply
    } catch (err) {
      log.error({ mint: mint.toBase58(), error: err }, 'Supply fetch failed')
      throw new Error(`Failed to fetch supply for ${mint}`)
    }
  }
  private async fetchPrices(
    symbols: string[]
  ): Promise<Record<string, number>> {
    const ids = symbols
      .map((symbol) => symbolToCoinGeckoID(symbol))
      .filter((id): id is string => Boolean(id))

    const query = qs.stringify({
      ids: ids.join(','),
      vs_currencies: 'usd',
    })

    const url = `${this.COINGECKO_API_URL}/simple/price?${query}`

    try {
      const response = await request<Record<string, CoinGeckoDataResponse>>(
        url,
        {
          headers: { 'x-cg-demo-api-key': env.COINGECKO_API_KEY },
        }
      )

      const prices: Record<string, number> = {}
      for (const symbol of symbols) {
        const id = symbolToCoinGeckoID(symbol)
        if (!id) continue
        const price = response[id]?.usd

        if (!price) {
          log.warn(`Missing price for symbol: ${symbol} (CoinGecko ID: ${id})`)
          continue
        }

        prices[symbol] = price
      }

      return prices
    } catch (err) {
      log.error({ symbols, error: err }, 'Price fetch failed')
      throw new Error('Failed to fetch token prices')
    }
  }
}
