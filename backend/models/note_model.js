const { pool } = require("../db/connect");

const Note = {
  create: async (title, content, tags, userId) => {
    const query = `
      INSERT INTO notes (title, content, user_id, tags)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;

    const values = [title, content, userId, tags || []];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  findNote: async (noteId, userId) => {
    const query = `SELECT * FROM notes WHERE id = $1 AND user_id = $2`;
    const values = [noteId, userId];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  findAllNotes: async (userId) => {
    const query = `SELECT * FROM notes WHERE user_id = $1 ORDER BY is_pinned DESC, updated_at DESC`;
    const values = [userId];

    const result = await pool.query(query, values);
    return result.rows;
  },

  update: async (noteId, userId, updates) => {
    const { title, content, tags, is_pinned } = updates;
    const query = `
      UPDATE notes
      SET title = $1,
          content = $2,
          tags = $3,
          is_pinned = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND user_id = $6
      RETURNING *`;

    const values = [title, content, tags, is_pinned, noteId, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (noteId, userId) => {
    const query = `DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id`;
    const values = [noteId, userId];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  updatePinStatus: async (noteId, userId, isPinned) => {
    const query = `UPDATE notes SET is_pinned = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *`;

    const values = [Boolean(isPinned), noteId, userId];

    const result = await pool.query(query, values);

    return result.rows[0];
  },

  search: async (userId, searchTerm) => {
    const query = `SELECT * FROM notes WHERE user_id = $1 AND (title ILIKE $2 OR content ILIKE $2) ORDER BY updated_at DESC`;
    const values = [userId, `%${searchTerm}%`];

    const result = await pool.query(query, values);

    return result.rows;
  },
};

module.exports = Note;

//   // Get all notes for a user with pagination
// findAllByUser: async (userId, page = 1, filter = {}) => {
//   const limit = 9;
//   const offset = (page - 1) * limit;
//   let whereClause = "WHERE user_id = $1";
//   const values = [userId];
//   let paramCount = 2;

//   // Handle filters
//   if (filter.is_pinned !== undefined) {
//     whereClause += ` AND is_pinned = $${paramCount}`;
//     values.push(filter.is_pinned);
//     paramCount++;
//   }

//   if (filter.tag) {
//     whereClause += ` AND $${paramCount} = ANY(tags)`;
//     values.push(filter.tag);
//     paramCount++;
//   }

//   const query = `
//     SELECT *, COUNT(*) OVER() as total_count
//     FROM notes
//     ${whereClause}
//     ORDER BY
//       CASE WHEN is_pinned = true THEN 0 ELSE 1 END,
//       updated_at DESC
//     LIMIT $${paramCount} OFFSET $${paramCount + 1}`;

//   values.push(limit, offset);
//   const result = await db.query(query, values);

//   return {
//     notes: result.rows.map((row) => {
//       const { total_count, ...note } = row;
//       return note;
//     }),
//     total: result.rows[0] ? parseInt(result.rows[0].total_count) : 0,
//     page,
//     limit,
//   };
// },

//   // Get a single note by ID
//   findById: async (noteId, userId) => {
//     const query = `SELECT * FROM notes WHERE id = $1 AND user_id = $2`;
//     const result = await db.query(query, [noteId, userId]);
//     return result.rows[0];
//   },

//   // Search notes by title or content
//   search: async (userId, searchTerm, page = 1, limit = 10) => {
//     const offset = (page - 1) * limit;
//     const query = `
//       SELECT *,
//              COUNT(*) OVER() as total_count,
//              ts_rank(
//                to_tsvector('english', title || ' ' || content),
//                plainto_tsquery('english', $1)
//              ) as rank
//       FROM notes
//       WHERE user_id = $2
//         AND to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('english', $1)
//       ORDER BY rank DESC, updated_at DESC
//       LIMIT $3 OFFSET $4`;

//     const result = await db.query(query, [searchTerm, userId, limit, offset]);

//     return {
//       notes: result.rows.map(row => {
//         const { total_count, rank, ...note } = row;
//         return note;
//       }),
//       total: result.rows[0] ? parseInt(result.rows[0].total_count) : 0
//     };
//   },

// module.exports = Note;
