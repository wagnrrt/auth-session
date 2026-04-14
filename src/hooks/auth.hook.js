import { BaseError } from "../errors/base-error.js"
import { findSessionByToken } from "../modules/auth/auth.repository.js"

export async function authenticate(request, reply) {
  const cookie = request.cookies.session
  if (!cookie) throw new BaseError('unauthorized', 401)

  const { value, valid } = request.unsignCookie(cookie)
  if (!valid) {
    throw new BaseError('unauthorized', 401)
  }

  const session = await findSessionByToken(value)
  if (!session) {
    throw new BaseError('unauthorized', 401)
  }

  request.user = {
    id: session.userId,
    sessionId: session.id
  }
}
