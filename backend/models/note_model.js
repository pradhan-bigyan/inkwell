// const db = require('../db/connection');

// const Note = {
//   // Create a new note
//   create: async (title, content, userId, tags = [], isPinned = false) => {
//     const query = `
//       INSERT INTO notes (title, content, user_id, tags, is_pinned)
//       VALUES ($1, $2, $3, $4, $5)
//       RETURNING *`;

//     const values = [title, content, userId, tags, isPinned];
//     const result = await db.query(query, values);
//     return result.rows[0];
//   },

//   // Get all notes for a user with pagination
//   findAllByUser: async (userId, page = 1, limit = 10, filter = {}) => {
//     const offset = (page - 1) * limit;
//     let whereClause = 'WHERE user_id = $1';
//     const values = [userId];
//     let paramCount = 2;

//     // Handle filters
//     if (filter.is_pinned !== undefined) {
//       whereClause += ` AND is_pinned = $${paramCount}`;
//       values.push(filter.is_pinned);
//       paramCount++;
//     }

//     if (filter.tag) {
//       whereClause += ` AND $${paramCount} = ANY(tags)`;
//       values.push(filter.tag);
//       paramCount++;
//     }

//     const query = `
//       SELECT *, COUNT(*) OVER() as total_count
//       FROM notes
//       ${whereClause}
//       ORDER BY
//         CASE WHEN is_pinned = true THEN 0 ELSE 1 END,
//         updated_at DESC
//       LIMIT $${paramCount} OFFSET $${paramCount + 1}`;

//     values.push(limit, offset);
//     const result = await db.query(query, values);

//     return {
//       notes: result.rows.map(row => {
//         const { total_count, ...note } = row;
//         return note;
//       }),
//       total: result.rows[0] ? parseInt(result.rows[0].total_count) : 0,
//       page,
//       limit
//     };
//   },

//   // Get a single note by ID
//   findById: async (noteId, userId) => {
//     const query = `SELECT * FROM notes WHERE id = $1 AND user_id = $2`;
//     const result = await db.query(query, [noteId, userId]);
//     return result.rows[0];
//   },

//   // Update a note
//   update: async (noteId, userId, updates) => {
//     const { title, content, tags, is_pinned } = updates;
//     const query = `
//       UPDATE notes
//       SET title = $1,
//           content = $2,
//           tags = $3,
//           is_pinned = $4,
//           updated_at = CURRENT_TIMESTAMP
//       WHERE id = $5 AND user_id = $6
//       RETURNING *`;

//     const values = [title, content, tags, is_pinned, noteId, userId];
//     const result = await db.query(query, values);
//     return result.rows[0];
//   },

//   // Delete a note
//   delete: async (noteId, userId) => {
//     const query = `DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id`;
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

//   // Get all tags for a user
//   getAllTags: async (userId) => {
//     const query = `
//       SELECT DISTINCT unnest(tags) as tag
//       FROM notes
//       WHERE user_id = $1 AND array_length(tags, 1) > 0
//       ORDER BY tag`;

//     const result = await db.query(query, [userId]);
//     return result.rows.map(row => row.tag);
//   }
// };

// module.exports = Note;
