/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

const ThreadsTableTestHelper = {
    async addThread ({ id = 'thread_id-123', title = 'The Title of the Thread', body = 'The Body of the Thread', ownerId = 'user_id-123', createdAt = new Date().toISOString() }) {
        await pool.query(`INSERT INTO threads VALUES('${id}', '${ownerId}', '${title}', '${body}', '${createdAt}')`)
    },

    async findThreadsById (id) {
        const result = await pool.query(`SELECT * FROM threads WHERE id = '${id}'`)
        return result.rows
    },

    async cleanTable () {
        await pool.query('DELETE FROM threads WHERE 1=1')
    }
}

export default ThreadsTableTestHelper
