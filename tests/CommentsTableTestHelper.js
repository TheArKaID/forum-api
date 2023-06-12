/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

const CommentsTableTestHelper = {
    async createComment ({ id = 'comment_id-123', threadId = 'thread_id-123', content = 'A New Comment', ownerId = 'user_id-123', createdAt = new Date().toISOString() }) {
        const query = {
            text: `INSERT INTO comments
                    VALUES($1, $2, $3, $4, $5)`,
            values: [id, threadId, ownerId, content, createdAt]
        }

        await pool.query(query)
    },

    async checkCommentById (id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id]
        }

        const result = await pool.query(query)

        return result.rows
    },

    async findCommentsByThreadId (threadId) {
        const query = {
            text: 'SELECT * FROM comments WHERE thread_id = $1',
            values: [threadId]
        }

        const result = await pool.query(query)

        return result.rows
    },

    async cleanTable () {
        await pool.query('DELETE FROM comments')
    }
}

export default CommentsTableTestHelper
