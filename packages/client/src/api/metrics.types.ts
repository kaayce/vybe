export interface TPSData {
  data: {
    timestamp: number
    tps: number
    blockTime: number
    txCount: number
  }[]
}
