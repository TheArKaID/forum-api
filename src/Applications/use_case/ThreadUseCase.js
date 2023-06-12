import NewThread from '../../Domains/threads/entities/NewThread.js'

class ThreadUseCase {
    constructor (threadRepository, commentRepository, replyRepository, likeCommentRepository) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._replyRepository = replyRepository
        this._likeCommentRepository = likeCommentRepository
    }

    async createThread (payLoad, ownerId) {
        const newThread = new NewThread(payLoad)
        return this._threadRepository.createThread(newThread, ownerId)
    }

    async getThreadById (threadId) {
        const thread = await this._threadRepository.getThreadById(threadId)
        const comments = await this._commentRepository.getCommentsByThreadId(threadId)
        const commentsRepliesLikes = await Promise.all(comments.map(async (comment) => {
            const replies = await this._replyRepository.getRepliesByCommentId(comment.id)
            const likeCount = await this._likeCommentRepository.getLikeCountByCommentId(comment.id)
            return { ...comment, replies, likeCount }
        }))

        return {
            ...thread,
            comments: commentsRepliesLikes
        }
    }
}

export default ThreadUseCase
