const { pool } = require("../db/connect");
const bcrypt = require("bcrypt");

const User = {
  create: async (fullName, email, password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const query = `INSERT INTO users (full_name, email, password_hash) 
                        VALUES ($1, $2, $3) 
                        RETURNING id, full_name, email, dark_mode, created_at`;
    const values = [fullName, email, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  getUser: async (userId) => {
    const query = `SELECT * FROM users WHERE id = $1`;
    const values = [userId];

    const result = await pool.query(query, values);

    return result.rows[0];
  },

  findByEmail: async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  findById: async (id) => {
    const query = `SELECT id, full_name, email, dark_mode, created_at FROM users WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = User;
