import { createMiddleware } from 'hono/factory'
import { TRACING } from '../../lib/constants.js'

const randomString = (length: number): string => {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)

  return Array.from(array)
    .map((x) => charset[x % charset.length])
    .join('')
}

export const tracing = createMiddleware(async (c, next) => {
  c.set(TRACING, randomString(10))
  await next()
})
