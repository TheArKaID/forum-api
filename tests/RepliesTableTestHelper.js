/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

const RepliesTableTestHelper = {
    async addReply ({ id = 'reply_id-123', commentId = 'comment_id-123', content = 'A Reply of Comment', ownerId = 'user_id-123', createdAt = new Date().toISOString() }) {
        await pool.query(`INSERT INTO replies VALUES('${id}', '${commentId}', '${ownerId}', '${content}', '${createdAt}')`)
    },

    async findReplyById (id) {
        const result = await pool.query(`SELECT * FROM replies WHERE id = '${id}'`)
        return result.rows
    },

    async findRepliesByCommentId (commentId) {
        const result = await pool.query(`SELECT * FROM replies WHERE comment_id = '${commentId}'`)
        return result.rows
    },

    async cleanTable () {
        await pool.query('DELETE FROM replies WHERE 1=1')
    }
}

export default RepliesTableTestHelper
