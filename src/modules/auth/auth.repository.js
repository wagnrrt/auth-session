import { BaseError } from "../../errors/base-error.js"

export async function insertUser(c, user) {
  try {
    await c.query(
      'INSERT INTO users (id, name, email) VALUES (UUID_TO_BIN(?), ?, ?)',
      [user.id, user.name, user.email]
    )
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      throw new BaseError('this email or account is already in use.', 409)
    throw err
  }
}

export async function insertCredential(c, credential) {
  await c.query(
    'INSERT INTO credentials (user_id, password) VALUES (UUID_TO_BIN(?), ?)',
    [credential.userId, credential.password]
  )
}

export async function insertSession(c, session) {
  await c.query(
    'INSERT INTO sessions (id, user_id, token, expires_at, ip_address, os, browser, device) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)',
    [
      session.id,
      session.userId,
      session.token,
      session.expiresAt,
      session.ipAddress,
      session.os,
      session.browser,
      session.device,
    ]
  )
}

export async function findAuthDataByEmail(c, email) {
  const [rows] = await c.query(
    'SELECT BIN_TO_UUID(u.id) as id, c.password FROM users u JOIN credentials c ON u.id = c.user_id WHERE u.email = ?',
    [email]
  )

  return rows[0] ?? null
}

export async function findSessionByToken(c, token) {
  const [rows] = await c.query(
    'SELECT BIN_TO_UUID(s.id) as id, BIN_TO_UUID(u.id) as userId, u.name, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ? AND expires_at > NOW()',
    [token]
  )

  return rows[0] ?? null
}
