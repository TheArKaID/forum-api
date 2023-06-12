import AddedThread from '../../Domains/threads/entities/AddedThread.js'
import DetailThread from '../../Domains/threads/entities/DetailThread.js'
import ThreadRepository from '../../Domains/threads/ThreadRepository.js'
import NotFoundError from '../../Commons/exceptions/NotFoundError.js'

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor (pool, generateID) {
        super()
        this._pool = pool
        this._generateID = generateID
    }

    async createThread (newThread, ownerId) {
        const { title, body } = newThread
        const id = `thread_id-${this._generateID()}`

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner_id AS owner',
            values: [id, ownerId, title, body]
        }

        const result = await this._pool.query(query)

        return new AddedThread({ ...result.rows[0] })
    }

    async getThreadById (threadId) {
        const query = {
            text: 'SELECT threads.id AS id, title, body, created_at as date, username FROM threads JOIN users on owner_id = users.id WHERE threads.id = $1',
            values: [threadId]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Thread not found')
        }

        return new DetailThread({ ...result.rows[0] })
    }
}

export default ThreadRepositoryPostgres
