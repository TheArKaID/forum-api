import LikeCommentRepository from '../../Domains/likeComments/LikeCommentRepository.js'

class LikeCommentRepositoryPostgres extends LikeCommentRepository {
    constructor (pool, generateID) {
        super()
        this._pool = pool
        this._generateID = generateID
    }

    async checkLikeComment (commentId, ownerId) {
        const query = {
            text: 'SELECT id FROM likes WHERE comment_id = $1 AND owner_id = $2',
            values: [commentId, ownerId]
        }

        const result = await this._pool.query(query)

        return result.rowCount
    }

    async likeComment (commentId, ownerId) {
        const id = `like_id-${this._generateID()}`

        const query = {
            text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id',
            values: [id, ownerId, commentId]
        }

        const result = await this._pool.query(query)

        return result.rows[0].id
    }

    async getLikeCountByCommentId (commentId) {
        const query = {
            text: 'SELECT COUNT(id) FROM likes WHERE comment_id = $1',
            values: [commentId]
        }

        const result = await this._pool.query(query)

        return parseInt(result.rows[0].count)
    }

    async unlikeComment (commentId, ownerId) {
        const query = {
            text: 'DELETE FROM likes WHERE comment_id = $1 AND owner_id = $2',
            values: [commentId, ownerId]
        }

        await this._pool.query(query)
    }
}

export default LikeCommentRepositoryPostgres
