import ReplyUseCase from '../../../../Applications/use_case/ReplyUseCase.js'

class RepliesHandler {
    constructor (container) {
        this._container = container

        this.postReplyHandler = this.postReplyHandler.bind(this)
        this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this)
    }

    async postReplyHandler (request, h) {
        const { threadId, commentId } = request.params
        const { id: credentialId } = request.auth.credentials

        const replyUseCase = this._container.getInstance(ReplyUseCase.name)
        const addedReply = await replyUseCase.addReply(request.payload, threadId, commentId, credentialId)

        const response = h.response({
            status: 'success',
            data: {
                addedReply
            }
        })

        response.code(201)
        return response
    }

    async deleteReplyByIdHandler (request, h) {
        const { threadId, commentId, replyId } = request.params
        const { id: credentialId } = request.auth.credentials

        const replyUseCase = this._container.getInstance(ReplyUseCase.name)
        await replyUseCase.deleteReplyById(threadId, commentId, replyId, credentialId)

        const response = h.response({
            status: 'success'
        })

        response.code(200)
        return response
    }
}

export default RepliesHandler
