import InvariantError from '../../Commons/exceptions/InvariantError.js'
import AuthenticationRepository from '../../Domains/authentications/AuthenticationRepository.js'

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
    constructor (pool) {
        super()
        this._pool = pool
    }

    async addToken (token) {
        await this._pool.query(`INSERT INTO authentications VALUES ('${token}')`)
    }

    async checkAvailabilityToken (token) {
        const result = await this._pool.query(`SELECT * FROM authentications WHERE token = '${token}'`)

        if (result.rows.length === 0) {
            throw new InvariantError('refresh token tidak ditemukan di database')
        }
    }

    async deleteToken (token) {
        await this._pool.query(`DELETE FROM authentications WHERE token = '${token}'`)
    }
}

export default AuthenticationRepositoryPostgres
