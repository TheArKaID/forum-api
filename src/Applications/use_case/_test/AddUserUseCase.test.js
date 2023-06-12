import { jest, describe, it, expect } from '@jest/globals'
import AddUserUseCase from '../AddUserUseCase.js'
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js'
import RegisteredUser from '../../../Domains/users/entities/RegisteredUser.js'
import UserRepository from '../../../Domains/users/UserRepository.js'
import PasswordHash from '../../security/PasswordHash.js'

describe('AddUserUseCase', () => {
    it('should orchestrating the add user action correctly', async () => {
        const payLoad = {
            username: 'dicoding',
            password: 'secret',
            fullname: 'Dicoding Indonesia'
        }

        const mockRegisteredUser = new RegisteredUser({
            id: 'user_id-123',
            username: payLoad.username,
            fullname: payLoad.fullname
        })

        const mockUserRepository = new UserRepository()
        const mockPasswordHash = new PasswordHash()

        mockUserRepository.checkUsername = jest.fn().mockImplementation(() => Promise.resolve())
        mockUserRepository.createUser = jest.fn().mockImplementation(() => Promise.resolve(mockRegisteredUser))
        mockPasswordHash.hash = jest.fn().mockImplementation(() => Promise.resolve('encrypted_password'))

        const getUserUseCase = new AddUserUseCase(mockUserRepository, mockPasswordHash)

        const registeredUser = await getUserUseCase.execute(payLoad)

        expect(registeredUser).toStrictEqual(new RegisteredUser({
            id: 'user_id-123',
            username: payLoad.username,
            fullname: payLoad.fullname
        }))

        expect(mockUserRepository.checkUsername).toBeCalledWith(payLoad.username)
        expect(mockPasswordHash.hash).toBeCalledWith(payLoad.password)
        expect(mockUserRepository.createUser).toBeCalledWith(new RegisterUser({
            username: payLoad.username,
            password: 'encrypted_password',
            fullname: payLoad.fullname
        }))
    })
})
