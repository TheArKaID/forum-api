class LikeUseCase {
    constructor (threadRepository, commentRepository, likeRepository) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._likeRepository = likeRepository
    }

    async likeComment (threadId, commentId, ownerId) {
        await this._threadRepository.getThreadById(threadId)
        await this._commentRepository.checkCommentById(commentId)

        const liked = await this._likeRepository.checkLikeComment(commentId, ownerId)

        if (!liked) {
            await this._likeRepository.likeComment(commentId, ownerId)
        } else {
            await this._likeRepository.unlikeComment(commentId, ownerId)
        }
    }
}

export default LikeUseCase
