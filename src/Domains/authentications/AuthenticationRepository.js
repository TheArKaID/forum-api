class AuthenticationRepository {
    async generateToken (token) {
        throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async checkToken (token) {
        throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async deleteToken (token) {
        throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

export default AuthenticationRepository
