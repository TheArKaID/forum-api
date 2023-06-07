/* istanbul ignore file */
import pool from '../src/Infrastructures/database/postgres/pool.js'

const UsersTableTestHelper = {
    async addUser ({ id = 'user_id-123', username = 'dicoding', password = 'secret', fullname = 'Dicoding Indonesia' }) {
        await pool.query(`INSERT INTO users VALUES('${id}', '${username}', '${password}', '${fullname}')`)
    },

    async findUsersById (id) {
        const result = await pool.query(`SELECT * FROM users WHERE id = '${id}'`)
        return result.rows
    },

    async cleanTable () {
        await pool.query('DELETE FROM users WHERE 1=1')
    }
}

export default UsersTableTestHelper
