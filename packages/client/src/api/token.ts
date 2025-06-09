import env from '@/lib/env'
import type { TokensDataResponse } from './token.types'

const tokenEndpoint = '/token'
const baseUrl = `${env.VITE_API_BASE_URL}${tokenEndpoint}`

export const fetchBullishTokens = async (): Promise<TokensDataResponse> => {
  try {
    const response = await fetch(`${baseUrl}/bullish`)
    if (!response.ok) {
      throw new Error('Failed to fetch bullish tokens')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching bullish tokens:', error)
    throw error
  }
}
