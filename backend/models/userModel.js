// users table + queries. created_by links a viewer to the admin who made it
const { pool } = require("../config/db");

const SAFE_COLUMNS = "id, name, email, role, created_by, created_at";

async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          VARCHAR(100) NOT NULL,
      email         VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT         NOT NULL,
      role          VARCHAR(10)  NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
      created_by    INTEGER      REFERENCES users (id) ON DELETE CASCADE,
      created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );

    ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users (id) ON DELETE CASCADE;

    DROP INDEX IF EXISTS idx_users_created_at;
    CREATE INDEX IF NOT EXISTS idx_users_created_by ON users (created_by);
  `);
}

async function findByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
}

async function findById(id) {
  const result = await pool.query(`SELECT ${SAFE_COLUMNS} FROM users WHERE id = $1`, [id]);
  return result.rows[0];
}

async function findTeam(adminId) {
  const result = await pool.query(
    `SELECT ${SAFE_COLUMNS} FROM users
     WHERE id = $1 OR created_by = $1
     ORDER BY created_at DESC`,
    [adminId]
  );
  return result.rows;
}

async function create({ name, email, passwordHash, role, createdBy = null }, db = pool) {
  const result = await db.query(
    `INSERT INTO users (name, email, password_hash, role, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${SAFE_COLUMNS}`,
    [name, email, passwordHash, role, createdBy]
  );
  return result.rows[0];
}

async function updatePassword(id, adminId, passwordHash, client) {
  const result = await client.query(
    `UPDATE users SET password_hash = $1
     WHERE id = $2 AND created_by = $3
     RETURNING ${SAFE_COLUMNS}`,
    [passwordHash, id, adminId]
  );
  return result.rows[0];
}

async function remove(id, adminId) {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 AND created_by = $2 RETURNING id",
    [id, adminId]
  );
  return result.rows[0];
}

module.exports = { createTable, findByEmail, findById, findTeam, create, updatePassword, remove };
