export async function insertUser(c, user) {
  await c.query(
    'INSERT INTO users (id, name, email) VALUES (UUID_TO_BIN(?), ?, ?)',
    [user.id, user.name, user.email]
  )
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
