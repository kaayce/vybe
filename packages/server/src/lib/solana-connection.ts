import { Connection } from '@solana/web3.js'
import env from './env.js'

const rpcUrl = 'https://solana-mainnet.rpc.extrnode.com/' as const

const getSolanaRpcUrl = () => {
  return `${rpcUrl}${env.EXTRNODE_API_KEY}`
}
export const solanaConnection = new Connection(getSolanaRpcUrl(), 'confirmed')
