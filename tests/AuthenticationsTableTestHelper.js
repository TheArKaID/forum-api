/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

const AuthenticationsTableTestHelper = {
    async addToken (token) {
        await pool.query(`INSERT INTO authentications VALUES ('${token}')`)
    },

    async findToken (token) {
        const result = await pool.query(`SELECT token FROM authentications WHERE token = '${token}'`)

        return result.rows
    },
    async cleanTable () {
        await pool.query('DELETE FROM authentications WHERE 1=1')
    }
}

export default AuthenticationsTableTestHelper
