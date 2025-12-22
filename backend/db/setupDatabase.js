const { Client } = require("pg");
const fs = require("fs");
const config = require("../config.json");

async function setupTables() {
  const client = new Client({
    connectionString: config.connectionString,
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
