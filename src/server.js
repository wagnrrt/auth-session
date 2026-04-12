import 'dotenv/config'
import Fastify from 'fastify'
import { pool } from './plugin/db.js'
import cookie from '@fastify/cookie'
import { errorHandler } from './plugin/error-handler.js'
import { authRoutes } from './modules/auth/auth.routes.js'

export const server = Fastify({
  logger: true,
  trustProxy: true
})

errorHandler(server)

server.decorate('db', pool)
server.register(cookie)

server.register(authRoutes)
// server.register(userRoutes)

try {
  await server.listen({ port: 3000 })
} catch (err) {
  server.log.error(err)
  process.exit(1)
}
