class LikeRepository {
    async checkLikeComment (commentId, owner) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async likeComment (commentId, owner) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async getLikeCountByCommentId (commentId) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async unlikeComment (commentId, owner) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

export default LikeRepository
