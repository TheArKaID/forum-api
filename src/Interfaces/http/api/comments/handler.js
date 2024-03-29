import CommentUseCase from '../../../../Applications/use_case/CommentUseCase.js'

class CommentsHandler {
    constructor (container) {
        this._container = container

        this.postCommentHandler = this.postCommentHandler.bind(this)
        this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this)
    }

    async postCommentHandler (request, h) {
        const { threadId } = request.params
        const { id: credentialId } = request.auth.credentials

        const commentUseCase = this._container.getInstance(CommentUseCase.name)
        const addedComment = await commentUseCase.createComment(request.payload, threadId, credentialId)

        const response = h.response({
            status: 'success',
            data: {
                addedComment
            }
        })

        response.code(201)
        return response
    }

    async deleteCommentByIdHandler (request, h) {
        const { threadId, commentId } = request.params
        const { id: credentialId } = request.auth.credentials

        const commentUseCase = this._container.getInstance(CommentUseCase.name)
        await commentUseCase.deleteCommentById(threadId, commentId, credentialId)

        const response = h.response({
            status: 'success'
        })

        response.code(200)
        return response
    }
}

export default CommentsHandler
