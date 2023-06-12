class ThreadRepository {
    async createThread (newThread, ownerId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async getThreadById (threadId) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

export default ThreadRepository
