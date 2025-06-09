import type { Connection } from '@solana/web3.js'
import { logger } from '../lib/logger.js'
import { solanaConnection } from '../lib/solana-connection.js'
import type { TPSData } from './tps.types.js'

const log = logger.child({ service: 'TPSService' })

export class TPSService {
  private readonly connection: Connection

  constructor() {
    this.connection = solanaConnection
    log.info('TPSService initialized')
  }

  /** Get the latest TPS data */
  async getLatestTPS(): Promise<TPSData> {
    try {
      const sample = await this.getSingleSample()
      const data = this.sampleToTPSData(sample)
      log.debug({ tps: data.tps }, 'Fetched latest TPS')
      return data
    } catch (error) {
      log.error({ error }, 'Failed to fetch latest TPS')
      throw error
    }
  }

  /** Get historical TPS data for a given duration (in seconds) */
  async getTPSHistory(duration = 3600): Promise<TPSData[]> {
    if (!Number.isFinite(duration) || duration <= 0 || duration > 86400) {
      const error = new Error('Duration must be between 1 and 86400 seconds')
      log.warn({ duration }, error.message)
      throw error
    }
    try {
      const sampleCount = Math.max(1, Math.min(60, Math.floor(duration / 60)))
      const samples =
        await this.connection.getRecentPerformanceSamples(sampleCount)
      if (!samples.length) {
        log.warn('No performance samples returned')
        return []
      }
      const now = Date.now()
      const result = samples.map((sample, i) =>
        this.sampleToTPSData(
          sample,
          now - (samples.length - 1 - i) * sample.samplePeriodSecs * 1000
        )
      )
      log.debug({ count: result.length }, 'Fetched TPS history')
      return result
    } catch (error) {
      log.error({ error, duration }, 'Failed to fetch TPS history')
      throw error
    }
  }

  private async getSingleSample() {
    const samples = await this.connection.getRecentPerformanceSamples(1)
    if (!samples.length) throw new Error('No performance samples available')
    return samples[0]
  }

  private sampleToTPSData(
    sample: { numTransactions: number; samplePeriodSecs: number },
    timestamp?: number
  ): TPSData {
    const tps =
      sample.samplePeriodSecs > 0
        ? sample.numTransactions / sample.samplePeriodSecs
        : 0
    return {
      timestamp: timestamp ?? Date.now(),
      tps,
      blockTime: sample.samplePeriodSecs,
      txCount: sample.numTransactions,
    }
  }
}

export type { TPSData }
