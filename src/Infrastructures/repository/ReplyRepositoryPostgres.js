import AddedReply from '../../Domains/replies/entities/AddedReply.js'
import DetailReply from '../../Domains/replies/entities/DetailReply.js'
import ReplyRepository from '../../Domains/replies/ReplyRepository.js'
import NotFoundError from '../../Commons/exceptions/NotFoundError.js'
import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js'

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor (pool, generateID) {
        super()
        this._pool = pool
        this._generateID = generateID
    }

    async createReply (newReply, commentId, owner) {
        const { content } = newReply
        const id = `reply_id-${this._generateID()}`

        const query = {
            text: `INSERT INTO replies
                    VALUES($1, $2, $3, $4)
                    RETURNING id, content, owner_id AS owner`,
            values: [id, commentId, owner, content]
        }

        const result = await this._pool.query(query)

        return new AddedReply({ ...result.rows[0] })
    }

    async getRepliesByCommentId (commentId) {
        const query = {
            text: `SELECT replies.id AS id, username, created_at as date, content, is_deleted
                    FROM replies JOIN users on owner_id = users.id
                    WHERE comment_id = $1
                    ORDER BY date`,
            values: [commentId]
        }

        const result = await this._pool.query(query)

        return result.rows.map((payload) => (new DetailReply({
            ...payload,
            isDeleted: payload.is_deleted
        })))
    }

    async checkReplyOwner (replyId, owner) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [replyId]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Reply not found')
        }

        if (result.rows[0].owner_id !== owner) {
            throw new AuthorizationError('Cannot access reply, you are not the owner')
        }
    }

    async deleteReplyById (replyId) {
        const query = {
            text: 'UPDATE replies SET is_deleted = true WHERE id = $1',
            values: [replyId]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Reply not found')
        }
    }
}

export default ReplyRepositoryPostgres
