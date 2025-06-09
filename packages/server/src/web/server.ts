import { serveStatic } from '@hono/node-server/serve-static'
import type { Hono } from 'hono'
import { metricsRouter } from './controller/metrics.js'
import {
  serveInternalServerError,
  serveNotFound,
} from './controller/resp/error.js'
import { tokenRouter } from './controller/token.js'
import { walletRouter } from './controller/wallet.js'

export class Server {
  private app: Hono

  constructor(app: Hono) {
    this.app = app
  }

  public configure() {
    // api routes
    const api = this.app.basePath('/api/v1')
    api.route('/token', tokenRouter)
    api.route('/metrics', metricsRouter)
    api.route('/wallet', walletRouter)

    // static files
    this.app.use('/assets/*', serveStatic({ root: './dist' }))
    this.app.use('/favicon.ico', serveStatic({ root: './dist' }))
    this.app.use('/manifest.json', serveStatic({ root: './dist' }))
    this.app.use('/robots.txt', serveStatic({ root: './dist' }))
    this.app.use('/*', serveStatic({ path: './dist/index.html' }))

    // universal catch-all
    this.app.notFound((c) => {
      return serveNotFound(c)
    })

    // Error handling
    this.app.onError((err, c) => {
      return serveInternalServerError(c, err)
    })
  }
}
