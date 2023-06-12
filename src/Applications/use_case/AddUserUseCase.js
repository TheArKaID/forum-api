import RegisterUser from '../../Domains/users/entities/RegisterUser.js'

class AddUserUseCase {
    constructor (userRepository, passwordHash) {
        this._userRepository = userRepository
        this._passwordHash = passwordHash
    }

    async execute (payLoad) {
        const registerUser = new RegisterUser(payLoad)
        await this._userRepository.checkUsername(registerUser.username)
        registerUser.password = await this._passwordHash.hash(registerUser.password)
        return this._userRepository.createUser(registerUser)
    }
}

export default AddUserUseCase
