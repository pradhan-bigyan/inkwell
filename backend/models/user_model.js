const { pool } = require("../db/connect");
const bcrypt = require("bcrypt");

const User = {
  //Creating a new User
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

  findByEmail: async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },
};

module.exports = User;

// const db = require('../db/connection');

// const User = {
//   // Create a new user
//   create: async (fullName, email, passwordHash) => {
//     const query = `
//       INSERT INTO users (full_name, email, password_hash)
//       VALUES ($1, $2, $3)
//       RETURNING id, full_name, email, dark_mode, created_at`;

//     const values = [fullName, email, passwordHash];
//     const result = await db.query(query, values);
//     return result.rows[0];
//   },

//   // Find user by email
//   findByEmail: async (email) => {
//     const query = `SELECT * FROM users WHERE email = $1`;
//     const result = await db.query(query, [email]);
//     return result.rows[0];
//   },

//   // Find user by ID
//   findById: async (id) => {
//     const query = `SELECT id, full_name, email, dark_mode, created_at FROM users WHERE id = $1`;
//     const result = await db.query(query, [id]);
//     return result.rows[0];
//   },

//   // Update user's dark mode preference
//   updateDarkMode: async (userId, darkMode) => {
//     const query = `UPDATE users SET dark_mode = $1 WHERE id = $2 RETURNING dark_mode`;
//     const result = await db.query(query, [darkMode, userId]);
//     return result.rows[0].dark_mode;
//   },

//   // Update user profile
//   updateProfile: async (userId, updates) => {
//     const { full_name, email } = updates;
//     const query = `
//       UPDATE users
//       SET full_name = $1, email = $2, updated_at = CURRENT_TIMESTAMP
//       WHERE id = $3
//       RETURNING id, full_name, email`;

//     const result = await db.query(query, [full_name, email, userId]);
//     return result.rows[0];
//   }
// };

// module.exports = User;
