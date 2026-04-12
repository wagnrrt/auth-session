import bcrypt from 'bcrypt'
import { transaction } from '../../plugin/db.js';
import { v7 as uuidv7 } from 'uuid'
import { insertCredential, insertSession, insertUser } from './auth.repository.js';
import { hashToken } from '../../utils/hash.js';

export async function signUp(db, data) {
  const userId = uuidv7()
  const sessionId = uuidv7()
  const hash = await bcrypt.hash(data.password, 10)
  const token = crypto.randomUUID(32).toString('hex')

  try {
    await transaction(db, async (c) => {
      await insertUser(c, {
        id: userId,
        name: data.name,
        email: data.email,
      });

      await insertCredential(c, {
        userId,
        password: hash
      });

      await insertSession(c, {
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

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      throw new Error('this email or account is already in use.')

    throw err
  }

  return token
}
