/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

const CommentsTableTestHelper = {
    async addComment ({ id = 'comment_id-123', threadId = 'thread_id-123', content = 'A New Comment', ownerId = 'user_id-123', createdAt = new Date().toISOString() }) {
        await pool.query(`INSERT INTO comments VALUES('${id}', '${threadId}', '${ownerId}', '${content}', '${createdAt}')`)
    },

    async findCommentsById (id) {
        const result = await pool.query(`SELECT * FROM comments WHERE id = '${id}'`)

        return result.rows
    },

    async findCommentsByThreadId (threadId) {
        const result = await pool.query(`SELECT * FROM comments WHERE thread_id = '${threadId}'`)
        return result.rows
    },

    async cleanTable () {
        await pool.query('DELETE FROM comments WHERE 1=1')
    }
}

export default CommentsTableTestHelper
