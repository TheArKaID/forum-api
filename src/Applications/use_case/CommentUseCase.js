import NewComment from '../../Domains/comments/entities/NewComment.js'

class CommentUseCase {
    constructor (threadRepository, commentRepository) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
    }

    async createComment (payLoad, threadId, ownerId) {
        const newComment = new NewComment(payLoad)

        await this._threadRepository.getThreadById(threadId)

        return await this._commentRepository.createComment(newComment, threadId, ownerId)
    }

    async deleteCommentById (threadId, commentId, ownerId) {
        await this._threadRepository.getThreadById(threadId)
        await this._commentRepository.checkCommentbyOwnerId(commentId, ownerId)
        await this._commentRepository.deleteCommentById(commentId)
    }
}

export default CommentUseCase
