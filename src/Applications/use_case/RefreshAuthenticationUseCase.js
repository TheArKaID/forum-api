class RefreshAuthenticationUseCase {
    constructor (authenticationRepository, authenticationTokenManager) {
        this._authenticationRepository = authenticationRepository
        this._authenticationTokenManager = authenticationTokenManager
    }

    async execute (payLoad) {
        this._verifyPayload(payLoad)
        const { refreshToken } = payLoad

        await this._authenticationTokenManager.checkRefreshToken(refreshToken)
        await this._authenticationRepository.checkToken(refreshToken)

        const { username, id } = await this._authenticationTokenManager.decodePayload(refreshToken)

        return this._authenticationTokenManager.createAccessToken({ username, id })
    }

    _verifyPayload (payload) {
        const { refreshToken } = payload

        if (!refreshToken) {
            throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
        }

        if (typeof refreshToken !== 'string') {
            throw new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
        }
    }
}

export default RefreshAuthenticationUseCase
