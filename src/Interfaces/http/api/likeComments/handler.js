import LikeCommentUseCase from '../../../../Applications/use_case/LikeCommentUseCase.js'

class LikeCommentsHandler {
    constructor (container) {
        this._container = container

        this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this)
    }

    async putLikeCommentHandler (request, h) {
        const { threadId, commentId } = request.params
        const { id: credentialId } = request.auth.credentials

        const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name)
        await likeCommentUseCase.likeComment(threadId, commentId, credentialId)

        return {
            status: 'success'
        }
    }
}

export default LikeCommentsHandler
