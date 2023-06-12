import AddUserUseCase from '../../../../Applications/use_case/AddUserUseCase.js'

class UsersHandler {
    constructor (container) {
        this._container = container

        this.postUserHandler = this.postUserHandler.bind(this)
    }

    async postUserHandler (request, h) {
        const createUserUseCase = this._container.getInstance(AddUserUseCase.name)
        const addedUser = await createUserUseCase.execute(request.payload)

        const response = h.response({
            status: 'success',
            data: {
                addedUser
            }
        })
        response.code(201)
        return response
    }
}

export default UsersHandler
