// postgres pool + a small helper for transactions
const { Pool, types } = require("pg");
require("dotenv").config({ quiet: true });

types.setTypeParser(1082, (value) => value);
types.setTypeParser(1700, (value) => parseFloat(value));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (error) => {
  console.error("Unexpected database error:", error.message);
});

async function withTransaction(work) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { pool, withTransaction };
