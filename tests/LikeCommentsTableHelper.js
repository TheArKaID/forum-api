/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

const LikeCommentsTableHelper = {
    async likeComment ({ id = 'like_id-123', commentId = 'comment_id-123', owner = 'user_id-123', date = new Date().toISOString() }) {
        const query = {
            text: `INSERT INTO likes
                    VALUES($1, $2, $3, $4)`,
            values: [id, owner, commentId, date]
        }

        await pool.query(query)
    },

    async getLikeCountByCommentId (commentId) {
        const query = {
            text: 'SELECT COUNT(*) FROM likes WHERE comment_id = $1',
            values: [commentId]
        }

        const result = await pool.query(query)
        return parseInt(result.rows[0].count)
    },

    async cleanTable () {
        await pool.query('DELETE FROM likes')
    }
}

export default LikeCommentsTableHelper
