import { BaseError } from "../errors/base-error.js"
import { validateSessionToken } from "../modules/auth/auth.service.js"

export async function requireAuth(request, reply) {
  const cookie = request.cookies.session
  if (!cookie) throw new BaseError('unauthorized', 401)

  const { value, valid } = request.unsignCookie(cookie)
  if (!valid) {
    reply.clearCookie('session')
    throw new BaseError('unauthorized', 401)
  }

  const session = await validateSessionToken(request.server.db, value)
  if (!session) {
    reply.clearCookie('session')
    throw new BaseError('unauthorized', 401)
  }

  request.user = {
    id: session.userId,
    name: session.name,
    email: session.email,
    sessionId: session.id
  }
}
