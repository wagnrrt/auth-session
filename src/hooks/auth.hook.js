import { BaseError } from "../errors/base-error.js"
import { findSessionByToken } from "../modules/auth/auth.repository.js"

export async function authenticate(request, reply) {
  const token = request.cookies.session
  if (!token) throw new BaseError('unauthorized', 401)
  const session = await findSessionByToken(token)
  if (!session || session.expiresAt <= new Date()) throw new BaseError('unauthorized', 401)

  request.user = {
    id: session.userId,
    sessionId: session.id
  }
}
