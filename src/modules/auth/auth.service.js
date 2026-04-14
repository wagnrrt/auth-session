import bcrypt from 'bcrypt'
import { transaction } from '../../plugin/db.js';
import { v7 as uuidv7 } from 'uuid'
import { hashToken } from '../../utils/hash.js';
import { BaseError } from '../../errors/base-error.js';
import { randomBytes } from 'crypto'
import * as authRepository from "./auth.repository.js";

export async function signUp(db, data) {
  const userId = uuidv7()
  const sessionId = uuidv7()
  const hash = await bcrypt.hash(data.password, 10)
  const token = randomBytes(32).toString('hex')

  await transaction(db, async (c) => {
    await authRepository.insertUser(c, {
      id: userId,
      name: data.name,
      email: data.email,
    });

    await authRepository.insertCredential(c, {
      userId,
      password: hash
    });

    await authRepository.insertSession(c, {
      id: sessionId,
      userId,
      token: hashToken(token),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: data.ipAddress,
      os: data.os,
      browser: data.browser,
      device: data.device
    })
  });

  return token
}

export async function signIn(db, data) {
  const sessionId = uuidv7()
  const token = randomBytes(32).toString('hex')
  const authData = await authRepository.findAuthDataByEmail(db, data.email)
  if (!authData) throw new BaseError('invalid credentials', 401)

  if (!(await bcrypt.compare(data.password, authData.password)))
    throw new BaseError('invalid credentials', 401)

  await authRepository.insertSession(db, {
    id: sessionId,
    userId: authData.id,
    token: hashToken(token),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ipAddress: data.ipAddress,
    os: data.os,
    browser: data.browser,
    device: data.device
  })

  return token
}

export async function signOut(db, sessionId) {
  await authRepository.deleteSessionById(db, sessionId)
}
