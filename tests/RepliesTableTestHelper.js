/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

const RepliesTableTestHelper = {
    async createReply ({ id = 'reply_id-123', commentId = 'comment_id-123', content = 'A Reply of Comment', ownerId = 'user_id-123', createdAt = new Date().toISOString() }) {
        const query = {
            text: `INSERT INTO replies
                    VALUES($1, $2, $3, $4, $5)`,
            values: [id, commentId, ownerId, content, createdAt]
        }

        await pool.query(query)
    },

    async getReplyById (id) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [id]
        }

        const result = await pool.query(query)

        return result.rows
    },

    async getRepliesByCommentId (commentId) {
        const query = {
            text: 'SELECT * FROM replies WHERE comment_id = $1',
            values: [commentId]
        }

        const result = await pool.query(query)

        return result.rows
    },

    async cleanTable () {
        await pool.query('DELETE FROM replies')
    }
}

export default RepliesTableTestHelper
