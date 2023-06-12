/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

const ThreadsTableTestHelper = {
    async createThread ({ id = 'thread_id-123', title = 'The Title of the Thread', body = 'The Body of the Thread', ownerId = 'user_id-123', createdAt = new Date().toISOString() }) {
        const query = {
            text: `INSERT INTO threads
                    VALUES($1, $2, $3, $4, $5)`,
            values: [id, ownerId, title, body, createdAt]
        }

        await pool.query(query)
    },

    async findThreadsById (id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id]
        }

        const result = await pool.query(query)
        return result.rows
    },

    async cleanTable () {
        await pool.query('DELETE FROM threads')
    }
}

export default ThreadsTableTestHelper
