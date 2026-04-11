import bcrypt from 'bcrypt'
import { transaction } from '../../plugin/db.js';
import { v7 as uuidv7 } from 'uuid'

export const createUser = async (db, data) => {
  const userId = uuidv7()
  const hash = await bcrypt.hash(data.password, 10)

  try {
    await transaction(db, async (c) => {
      await c.query(
        'INSERT INTO users (id, name, email) VALUES (UUID_TO_BIN(?), ?, ?)',
        [userId, data.name, data.email]
      )

      await c.query(
        'INSERT INTO credentials (user_id, password) VALUES (UUID_TO_BIN(?), ?)',
        [userId, hash]
      )
    });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      throw new Error('this email or account is already in use.')

    throw err
  }
}
