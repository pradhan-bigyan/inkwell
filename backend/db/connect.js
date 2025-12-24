const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

const checkConnection = async () => {
  try {
    const date = await pool.query(`SELECT NOW()`);
    console.log(`PostgreSQL connection successful at:`, date.rows[0].now);
  } catch (error) {
    console.error("PostgreSQL connection failed:", error.message);
  }
};

module.exports = {
  pool,
  checkConnection,
};
