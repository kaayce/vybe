import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  PORT: z.string().default('3000'),
  LOG_LEVEL: z.string().default('info'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  EXTRNODE_API_KEY: z.string(),
  COINGECKO_API_KEY: z.string(),
})

export default envSchema.parse(process.env)
