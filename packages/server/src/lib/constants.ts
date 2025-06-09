import { logger } from './logger.js'

export const NODE_ENVIRONMENTS = {
  development: 'development',
  production: 'production',
} as const

export const TRACING = 'tracing' as const

export const BULLISH_5_TOKENS = {
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  FARTCOIN: '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump',
  TRUMP: '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN',
  WIF: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
} as const

export function symbolToCoinGeckoID(symbol: string): string | undefined {
  const symbolToId: Record<string, string> = {
    USDT: 'tether',
    USDC: 'usd-coin',
    FARTCOIN: 'fartcoin',
    TRUMP: 'official-trump',
    WIF: 'dogwifcoin',
  }

  const id = symbolToId[symbol]

  if (!id) {
    logger.warn(`Unknown symbol: ${symbol}`)
    return undefined
  }
  return id
}

export const trackedWallets = [
  '4nBihp31c2sjvBX865PYaZ35rEK2BmhXWv1G3B1bE11E',
  '93uo5JfTKiUHzeu8TSAbBKozT286haJtuG7z26ccTqt7',
  'FDGpDJg9hkFCqwAWZm5Wbc2kfHSCveEnevUAG8NXD4B4',
  '7NpgKGgP8runaCT87CxXVCBLN4T5LVqJPhP3i6FqbVTH',
  '3adBe8A3GJN7wzvYfojFpmLZHQmXPY2KwyciYnnvKvEQ',
  '6DqPQfvVUmiG9bzus4UYsH6YPDyXCpvzcyY8W5wTaTfQ',
  'GTH3eaVa6N4QmEeWW9vQwv2nSHFiaZaPYYUXJiv4DXJW',
  '5QmYnve5erNw91io87LRTWXJ5tEP6osixoK6sN7PrWmg',
  'qruJx4oxN9ioEj8BCFGxXySCgMiZ426WpCE5cnuUn3f',
  'HiE9yFvZ6ZpE3NBU9wSFdT8CAJxJPaXLfxUpbvfyTYd3',
] as const

export type Bullish5TokenKeys = keyof typeof BULLISH_5_TOKENS

// TTL values in seconds
export const TTL = {
  TOKEN: 300, // 5 minutes
  TPS: 60, // 1 minute
  WALLET: 600, // 5 minutes
  DEFAULT: 3600, // 1 hour
} as const
