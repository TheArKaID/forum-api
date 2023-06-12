/* istanbul ignore file */
import pkg from 'pg'

const { Pool } = pkg

const pool = process.env.NODE_ENV === 'test'
    ? new Pool({
        host: process.env.PGHOST_TEST,
        port: process.env.PGPORT_TEST,
        user: process.env.PGUSER_TEST,
        password: process.env.PGPASSWORD_TEST,
        database: process.env.PGDATABASE_TEST
    })
    : new Pool()

export default pool
