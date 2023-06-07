class ReplyRepository {
    async addReply (newReply, commentId, owner) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async verifyReplyOwner (replyId, owner) {
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
