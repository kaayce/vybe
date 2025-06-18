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
