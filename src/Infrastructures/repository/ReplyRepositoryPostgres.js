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

    async addReply (newReply, commentId, ownerId) {
        const { content } = newReply
        const id = `reply_id-${this._generateID()}`

        const result = await this._pool.query(`INSERT INTO replies VALUES('${id}', '${commentId}', '${ownerId}', '${content}') RETURNING id, content, owner_id as owner`)

        return new AddedReply({ ...result.rows[0] })
    }

    async getRepliesByCommentId (commentId) {
        const query = {
            text: 'SELECT replies.id AS id, username, created_at as date, content, is_deleted FROM replies JOIN users on owner_id = users.id WHERE comment_id = $1 ORDER BY date',
            values: [commentId]
        }

        const result = await this._pool.query(query)

        return result.rows.map((payload) => (new DetailReply({
            ...payload,
            isDeleted: payload.is_deleted
        })))
    }

    async verifyReplyOwner (replyId, ownerId) {
        const result = await this._pool.query(`SELECT * FROM replies WHERE id = '${replyId}'`)

        if (!result.rowCount) {
            throw new NotFoundError('Reply not found')
        }

        const reply = result.rows[0]
        if (reply.owner_id !== ownerId) {
            throw new AuthorizationError('Cannot delete comment, you are not the owner')
        }
    }

    async deleteReplyById (replyId) {
        const result = await this._pool.query(`UPDATE replies SET is_deleted = true WHERE id = '${replyId}' RETURNING id`)

        if (!result.rowCount) {
            throw new NotFoundError('Reply not found')
        }
    }
}

export default ReplyRepositoryPostgres
