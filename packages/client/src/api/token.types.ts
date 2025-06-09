export interface TokenData {
  price: number
  supply: number
  marketCap: number
  address: string
  lastUpdated: number
  symbol?: string
  name?: string
}

export type TokensDataResponse = {
  [key: string]: TokenData
}

// import type { TokenData } from '../token.types'

// export interface APIResponse<T> {
//   data: T
// }

// export type TokenAPIResponse = APIResponse<{
//   [key: string]: TokenData
// }>
