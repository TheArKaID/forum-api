import NewReply from '../../Domains/replies/entities/NewReply.js'

class ReplyUseCase {
    constructor (threadRepository, commentRepository, replyRepository) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._replyRepository = replyRepository
    }

    async addReply (useCasePayload, threadId, commentId, owner) {
        const newReply = new NewReply(useCasePayload)

        await this._threadRepository.getThreadById(threadId)
        await this._commentRepository.checkCommentById(commentId)

        return this._replyRepository.addReply(newReply, commentId, owner)
    }

    async deleteReplyById (threadId, commentId, replyId, owner) {
        await this._threadRepository.getThreadById(threadId)
        await this._commentRepository.checkCommentById(commentId)
        await this._replyRepository.verifyReplyOwner(replyId, owner)
        await this._replyRepository.deleteReplyById(replyId)
    }
}

export default ReplyUseCase
