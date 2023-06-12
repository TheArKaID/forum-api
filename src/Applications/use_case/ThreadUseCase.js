import NewThread from '../../Domains/threads/entities/NewThread.js'

class ThreadUseCase {
    constructor (threadRepository, commentRepository, replyRepository) {
        this._threadRepository = threadRepository
        this._commentRepository = commentRepository
        this._replyRepository = replyRepository
    }

    async createThread (payLoad, ownerId) {
        return this._threadRepository.createThread(new NewThread(payLoad), ownerId)
    }

    async getThreadById (threadId) {
        const thread = await this._threadRepository.getThreadById(threadId)
        const comments = await this._commentRepository.getCommentsByThreadId(threadId)

        const commentsReplies = await Promise.all(comments.map(async (comment) => {
            const replies = await this._replyRepository.getRepliesByCommentId(comment.id)
            return { ...comment, replies }
        }))

        return {
            ...thread,
            comments: commentsReplies
        }
    }
}

export default ThreadUseCase
