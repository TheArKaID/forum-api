import NewThread from '../../Domains/threads/entities/NewThread.js'

class ThreadUseCase {
    constructor (threadRepository, commentRepository, replyRepository, likeRepository) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._replyRepository = replyRepository
        this._likeRepository = likeRepository
    }

    async addThread (useCasePayload, owner) {
        const newThread = new NewThread(useCasePayload)
        return this._threadRepository.addThread(newThread, owner)
    }

    async getThreadById (threadId) {
        const thread = await this._threadRepository.getThreadById(threadId)
        const comments = await this._commentRepository.getCommentsByThreadId(threadId)
        const commentsRepliesLikes = await Promise.all(comments.map(async (comment) => {
            const replies = await this._replyRepository.getRepliesByCommentId(comment.id)
            const likeCount = await this._likeRepository.getLikeCountByCommentId(comment.id)
            return { ...comment, replies, likeCount }
        }))

        return {
            ...thread,
            comments: commentsRepliesLikes
        }
    }
}

export default ThreadUseCase
