class CommentRepository {
    async createComment (newComment, threadId, ownerId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async checkCommentbyOwnerId (commentId, ownerId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async deleteCommentById (commentId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async getCommentsByThreadId (threadId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async checkCommentById (commentId) {
        throw new Error('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

export default CommentRepository
