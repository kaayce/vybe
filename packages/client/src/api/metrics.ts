import env from '@/lib/env'
import type { TPSData } from './metrics.types'

const tpsEndpoint = '/metrics'
const baseUrl = `${env.VITE_API_BASE_URL}${tpsEndpoint}`

export const fetchTPS = async (): Promise<TPSData> => {
  try {
    const response = await fetch(`${baseUrl}/tps`)
    if (!response.ok) {
      throw new Error('Failed to fetch TPS data')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching TPS data:', error)
    throw error
  }
}
