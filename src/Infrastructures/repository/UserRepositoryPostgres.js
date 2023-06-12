import InvariantError from '../../Commons/exceptions/InvariantError.js'
import RegisteredUser from '../../Domains/users/entities/RegisteredUser.js'
import UserRepository from '../../Domains/users/UserRepository.js'

class UserRepositoryPostgres extends UserRepository {
    constructor (pool, generateID) {
        super()
        this._pool = pool
        this._generateID = generateID
    }

    async checkUsername (username) {
        const query = {
            text: 'SELECT username FROM users WHERE username = $1',
            values: [username]
        }

        const result = await this._pool.query(query)

        if (result.rowCount) {
            throw new InvariantError('username tidak tersedia')
        }
    }

    async createUser (registerUser) {
        const { username, password, fullname } = registerUser
        const id = `user_id-${this._generateID()}`

        const query = {
            text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
            values: [id, username, password, fullname]
        }

        const result = await this._pool.query(query)

        return new RegisteredUser({ ...result.rows[0] })
    }

    async getPasswordByUsername (username) {
        const query = {
            text: 'SELECT password FROM users WHERE username = $1',
            values: [username]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new InvariantError('Username not found')
        }

        return result.rows[0].password
    }

    async getIdByUsername (username) {
        const query = {
            text: 'SELECT id FROM users WHERE username = $1',
            values: [username]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new InvariantError('User not found')
        }

        return result.rows[0].id
    }
}

export default UserRepositoryPostgres
