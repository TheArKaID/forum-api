import LikeUseCase from '../../../../Applications/use_case/LikeUseCase.js'

class LikesHandler {
    constructor (container) {
        this._container = container

        this.putLikeHandler = this.putLikeHandler.bind(this)
    }

    async putLikeHandler (request, h) {
        const { threadId, commentId } = request.params
        const { id: credentialId } = request.auth.credentials

        const likeUseCase = this._container.getInstance(LikeUseCase.name)
        await likeUseCase.likeComment(threadId, commentId, credentialId)

        return {
            status: 'success'
        }
    }
}

export default LikesHandler
