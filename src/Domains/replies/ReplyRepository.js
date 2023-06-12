class ReplyRepository {
    async createReply (newReply, commentId, ownerId) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async checkReplyOwner (replyId, ownerId) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async deleteReplyById (replyId) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async getRepliesByCommentId (commentId) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

export default ReplyRepository
