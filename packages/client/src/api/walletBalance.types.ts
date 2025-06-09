export interface WalletBalance {
  address: string
  balance: number
}

export interface WalletBalanceResponse {
  data: WalletBalance[]
}
