class LikeCommentRepository {
    async checkLikeComment (commentId, ownerId) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async likeComment (commentId, ownerId) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async getLikeCountByCommentId (commentId) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async unlikeComment (commentId, ownerId) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

export default LikeCommentRepository
