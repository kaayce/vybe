import env from '@/lib/env'
import type { WalletBalanceResponse } from './walletBalance.types'

const walletBalanceEndpoint = '/wallet'
const baseUrl = `${env.VITE_API_BASE_URL}${walletBalanceEndpoint}`

export const fetchTrackedWalletsBalance =
  async (): Promise<WalletBalanceResponse> => {
    try {
      const response = await fetch(`${baseUrl}/balances`)
      if (!response.ok) {
        throw new Error('Failed to fetch wallet balance')
      }
      return response.json()
    } catch (error) {
      console.error('Error fetching wallet balance:', error)
      throw error
    }
  }
