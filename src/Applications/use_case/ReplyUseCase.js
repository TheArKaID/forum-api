import NewReply from '../../Domains/replies/entities/NewReply.js'

class ReplyUseCase {
    constructor (threadRepository, commentRepository, replyRepository) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._replyRepository = replyRepository
    }

    async createReply (payLoad, threadId, commentId, ownerId) {
        const newReply = new NewReply(payLoad)

        await this._threadRepository.getThreadById(threadId)
        await this._commentRepository.checkCommentById(commentId)

        return this._replyRepository.createReply(newReply, commentId, ownerId)
    }

    async deleteReplyById (threadId, commentId, replyId, ownerId) {
        await this._threadRepository.getThreadById(threadId)
        await this._commentRepository.checkCommentById(commentId)
        await this._replyRepository.checkReplyOwner(replyId, ownerId)
        await this._replyRepository.deleteReplyById(replyId)
    }
}

export default ReplyUseCase
