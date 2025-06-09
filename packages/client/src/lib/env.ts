import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  VITE_API_BASE_URL: z.string().default('http://localhost:3000/api/v1'),
})

const viteEnv = import.meta.env

const processEnv = {
  NODE_ENV: viteEnv.MODE,
  VITE_API_BASE_URL: viteEnv.VITE_API_BASE_URL,
}

export default envSchema.parse(processEnv)
