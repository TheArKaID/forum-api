import AddedComment from '../../Domains/comments/entities/AddedComment.js'
import DetailComment from '../../Domains/comments/entities/DetailComment.js'
import CommentRepository from '../../Domains/comments/CommentRepository.js'
import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js'
import NotFoundError from '../../Commons/exceptions/NotFoundError.js'

class CommentRepositoryPostgres extends CommentRepository {
    constructor (pool, generateID) {
        super()
        this._pool = pool
        this._generateID = generateID
    }

    async checkCommentById (commentId) {
        const query = {
            text: `SELECT comments.id AS id, username, created_at as date, content, is_deleted
                    FROM comments
                    JOIN users on owner_id = users.id
                    WHERE comments.id = $1`,
            values: [commentId]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Comment not found')
        }
    }

    async createComment (newComment, threadId, owner) {
        const { content } = newComment
        const id = `comment_id-${this._generateID()}`

        const query = {
            text: `INSERT INTO comments
                    VALUES($1, $2, $3, $4)
                    RETURNING id, content, owner_id AS owner`,
            values: [id, threadId, owner, content]
        }

        const result = await this._pool.query(query)

        return new AddedComment(result.rows[0])
    }

    async checkCommentbyOwnerId (commentId, owner) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [commentId]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Comment not found')
        }

        if (result.rows[0].owner_id !== owner) {
            throw new AuthorizationError('Cannot access comment, you are not the owner')
        }
    }

    async getCommentsByThreadId (threadId) {
        const query = {
            text: `SELECT comments.id AS id, username, created_at as date, content, is_deleted
                    FROM comments JOIN users on owner_id = users.id
                    WHERE thread_id = $1 ORDER BY date`,
            values: [threadId]
        }
        const result = await this._pool.query(query)

        return result.rows.map((payload) => (new DetailComment({
            ...payload,
            isDeleted: payload.is_deleted
        })))
    }

    async deleteCommentById (commentId) {
        const query = {
            text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
            values: [commentId]
        }

        const result = await this._pool.query(query)

        if (!result.rowCount) {
            throw new NotFoundError('Comment not found')
        }
    }
}

export default CommentRepositoryPostgres
