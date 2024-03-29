import ThreadUseCase from '../../../../Applications/use_case/ThreadUseCase.js'

class ThreadsHandler {
    constructor (container) {
        this._container = container

        this.postThreadHandler = this.postThreadHandler.bind(this)
        this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this)
    }

    async postThreadHandler (request, h) {
        const { id: credentialId } = request.auth.credentials
        const threadUseCase = this._container.getInstance(ThreadUseCase.name)
        const addedThread = await threadUseCase.createThread(request.payload, credentialId)

        const response = h.response({
            status: 'success',
            data: {
                addedThread
            }
        })

        response.code(201)
        return response
    }

    async getThreadByIdHandler (request, h) {
        const { threadId } = request.params
        const threadUseCase = this._container.getInstance(ThreadUseCase.name)
        const thread = await threadUseCase.getThreadById(threadId)

        const response = h.response({
            status: 'success',
            data: {
                thread
            }
        })

        response.code(200)
        return response
    }
}

export default ThreadsHandler
