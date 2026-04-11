import mysql from 'mysql2/promise'

export const pool = mysql.createPool(process.env.DATABASE_URL)

export const transaction = async (pool, callback) => {
  const c = await pool.getConnection()
  try {
    await c.beginTransaction()
    const result = await callback(c)
    await c.commit()
    return result
  } catch (err) {
    await c.rollback()
    throw err
  } finally {
    c.release()
  }
}
