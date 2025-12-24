const { Client } = require("pg");
const fs = require("fs");
require("dotenv").config();

async function setupTables() {
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const sql = fs.readFileSync("./schema.sql", "utf8");

    await client.query(sql);
    console.log("✅ Tables created successfully!");
  } catch (error) {
    console.error("❌ Error creating tables:", error);
  } finally {
    await client.end();
  }
}

setupTables();
