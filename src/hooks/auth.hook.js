import { BaseError } from "../errors/base-error.js"
import { findSessionByToken } from "../modules/auth/auth.repository.js"
import { hashToken } from "../utils/hash.js"

export async function authenticate(request, reply) {
  const cookie = request.cookies.session
  if (!cookie) throw new BaseError('unauthorized', 401)

  const { value, valid } = request.unsignCookie(cookie)
  if (!valid) {
    reply.clearCookie('session')
    throw new BaseError('unauthorized', 401)
  }

  const session = await findSessionByToken(request.server.db, hashToken(value))
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
