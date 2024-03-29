/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

const AuthenticationsTableTestHelper = {
    async generateToken (token) {
        const query = {
            text: `INSERT INTO authentications
                    VALUES ($1)`,
            values: [token]
        }

        await pool.query(query)
    },

    async getOneToken (token) {
        const query = {
            text: 'SELECT token FROM authentications WHERE token = $1',
            values: [token]
        }

        const result = await pool.query(query)

        return result.rows
    },

    async cleanTable () {
        await pool.query('DELETE FROM authentications')
    }
}

export default AuthenticationsTableTestHelper
