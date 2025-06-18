// services/CoinGeckoPriceProvider.ts
import qs from 'qs'
import type { IPriceProvider } from '../interfaces/IPriceProvider.js'
import { symbolToCoinGeckoID } from '../lib/constants.js'
import env from '../lib/env.js'
import { logger } from '../lib/logger.js'
import { request } from '../lib/request.js'
import type { CoinGeckoDataResponse } from './CoinGeckoPriceProvider.types.js'

const log = logger.child({ service: 'CoinGeckoPriceProvider' })

export class CoinGeckoPriceProvider implements IPriceProvider {
  private readonly COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'

  async fetchPrices(symbols: string[]): Promise<Record<string, number>> {
    const ids = symbols
      .map((symbol) => symbolToCoinGeckoID(symbol))
      .filter((id): id is string => Boolean(id))

    if (ids.length === 0) {
      log.warn('No CoinGecko IDs found for provided symbols.')
      return {}
    }

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
      log.error({ symbols, error: err }, 'CoinGecko price fetch failed')
      throw new Error('Failed to fetch token prices from CoinGecko')
    }
  }
}
