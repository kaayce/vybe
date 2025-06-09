import type { Connection } from '@solana/web3.js'
import { logger } from '../lib/logger.js'
import { solanaConnection } from '../lib/solana-connection.js'
import type { TPSData } from './tps.types.js'

const log = logger.child({ service: 'TPSService' })

const MAX_DURATION = 86400 // 24 hours in seconds
const MAX_SAMPLES = 60 // getRecentPerformanceSamples supports up to 60 samples (1 sample = ~1 min)

export class TPSService {
  private readonly connection: Connection

  constructor() {
    this.connection = solanaConnection
    log.info('TPSService initialized')
  }

  /** Get historical TPS data for a given duration (in seconds) */
  async getTPSHistory(duration = 3600): Promise<TPSData[]> {
    if (
      !Number.isFinite(duration) ||
      duration <= 0 ||
      duration > MAX_DURATION
    ) {
      const error = new Error(
        `Duration must be between 1 and ${MAX_DURATION} seconds`
      )
      log.warn({ duration }, error.message)
      throw error
    }

    try {
      const sampleCount = Math.min(MAX_SAMPLES, Math.ceil(duration / 60))
      const samples =
        await this.connection.getRecentPerformanceSamples(sampleCount)

      if (!samples.length) {
        log.warn('No performance samples returned')
        return []
      }

      const now = Date.now()
      const result = samples.map((sample, i) => {
        // Set each sample's timestamp by going back one minute at a time from now
        const timestamp =
          now - (samples.length - 1 - i) * sample.samplePeriodSecs * 1000
        return this.sampleToTPSData(sample, timestamp)
      })

      log.debug({ count: result.length }, 'Fetched TPS history')
      return result
    } catch (error) {
      log.error({ error, duration }, 'Failed to fetch TPS history')
      throw error
    }
  }

  /** Convert a sample to TPSData format */
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
