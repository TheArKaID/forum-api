class LikeCommentUseCase {
    constructor (threadRepository, commentRepository, likeCommentRepository) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._likeCommentRepository = likeCommentRepository
    }

    async likeComment (threadId, commentId, ownerId) {
        await this._threadRepository.getThreadById(threadId)
        await this._commentRepository.checkCommentById(commentId)

        const liked = await this._likeCommentRepository.checkLikeComment(commentId, ownerId)

        if (!liked) {
            await this._likeCommentRepository.likeComment(commentId, ownerId)
        } else {
            await this._likeCommentRepository.unlikeComment(commentId, ownerId)
        }
    }
}

export default LikeCommentUseCase
