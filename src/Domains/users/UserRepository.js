class UserRepository {
    async createUser (registerUser) {
        throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async checkUsername (username) {
        throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async getPasswordByUsername (username) {
        throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async getIdByUsername (username) {
        throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

export default UserRepository
