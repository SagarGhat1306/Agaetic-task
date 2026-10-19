// refresh tokens. we only store the sha256 hash, never the token itself
const { pool } = require("../config/db");

async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER     NOT NULL REFERENCES users (id) ON DELETE CASCADE,
      token_hash  CHAR(64)    NOT NULL UNIQUE,
      expires_at  TIMESTAMPTZ NOT NULL,
      revoked_at  TIMESTAMPTZ,
      replaced_by INTEGER     REFERENCES refresh_tokens (id) ON DELETE SET NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS replaced_by INTEGER
      REFERENCES refresh_tokens (id) ON DELETE SET NULL;

    CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens (user_id);
  `);
}

async function create({ userId, tokenHash, expiresAt }, db = pool) {
  const result = await db.query(
    "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3) RETURNING id",
    [userId, tokenHash, expiresAt]
  );
  return result.rows[0].id;
}

async function findByHashForUpdate(tokenHash, client) {
  const result = await client.query(
    "SELECT * FROM refresh_tokens WHERE token_hash = $1 FOR UPDATE",
    [tokenHash]
  );
  return result.rows[0];
}

async function isActive(id, client) {
  const result = await client.query(
    "SELECT 1 FROM refresh_tokens WHERE id = $1 AND revoked_at IS NULL AND expires_at > NOW()",
    [id]
  );
  return result.rowCount > 0;
}

async function markReplaced(id, newId, client) {
  await client.query(
    "UPDATE refresh_tokens SET revoked_at = NOW(), replaced_by = $2 WHERE id = $1",
    [id, newId]
  );
}

async function revokeByHash(tokenHash) {
  await pool.query(
    "UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1 AND revoked_at IS NULL",
    [tokenHash]
  );
}

async function revokeAllForUser(userId, db = pool) {
  await db.query(
    "UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL",
    [userId]
  );
}

async function deleteExpired() {
  await pool.query("DELETE FROM refresh_tokens WHERE expires_at < NOW() - INTERVAL '1 day'");
}

module.exports = {
  createTable,
  create,
  findByHashForUpdate,
  isActive,
  markReplaced,
  revokeByHash,
  revokeAllForUser,
  deleteExpired,
};
