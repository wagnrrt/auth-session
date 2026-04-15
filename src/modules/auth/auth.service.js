import bcrypt from 'bcrypt'
import { transaction } from '../../plugin/db.js'
import { v7 as uuidv7 } from 'uuid'
import { hashToken } from '../../utils/hash.js'
import { BaseError } from '../../errors/base-error.js'
import { randomBytes } from 'crypto'
import * as authRepository from "./auth.repository.js"


async function generateSession(db, data) {
  const sessionId = uuidv7()
  const token = randomBytes(32).toString('hex')

  await authRepository.insertSession(db, {
    id: sessionId,
    token: hashToken(token),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ...data
  })

  return token
}

export async function signUp(db, data) {
  const userId = uuidv7()
  const hash = await bcrypt.hash(data.password, 10)

  return await transaction(db, async (c) => {
    await authRepository.insertUser(c, {
      id: userId,
      name: data.name,
      email: data.email
    })

    await authRepository.insertCredential(c, {
      userId,
      password: hash
    })

    return await generateSession(c, { userId, ...data })
  })
}

export async function signIn(db, data) {
  const authData = await authRepository.findAuthDataByEmail(db, data.email)
  if (!authData) throw new BaseError('invalid credentials', 401)

  if (!(await bcrypt.compare(data.password, authData.password)))
    throw new BaseError('invalid credentials', 401)

  return await generateSession(db, { userId: authData.id, ...data })
}

export async function signOut(db, sessionId) {
  await authRepository.deleteSessionById(db, sessionId)
}

export async function validateSessionToken(db, token) {
  return await authRepository.findSessionByToken(db, hashToken(token))
}
