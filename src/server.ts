import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import { errorHandler } from './plugins/error-handler'
import { authRoutes } from './modules/auth/auth.routes'

const server = Fastify({
  logger: true,
  trustProxy: true
})

errorHandler(server)

server.register(cookie, {
  secret: Bun.env.AUTH_SECRET,
})

server.decorateRequest('user', null)

server.register(authRoutes)

try {
  await server.listen({ port: 3000, host: "0.0.0.0" })
} catch (err) {
  server.log.error(err)
  process.exit(1)
}
