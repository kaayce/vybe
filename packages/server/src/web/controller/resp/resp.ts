import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import type { StatusCodes } from 'http-status-codes'

const serveData = <T>(c: Context, data: T) => {
  return c.json({ data })
}

const serve = <T>(c: Context, status: StatusCodes, data: T) => {
  return c.json({ data }, <ContentfulStatusCode>status)
}
export { serve, serveData }
