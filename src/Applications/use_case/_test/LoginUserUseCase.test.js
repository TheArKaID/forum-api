import { jest, describe, it, expect } from '@jest/globals'
import UserRepository from '../../../Domains/users/UserRepository.js'
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js'
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager.js'
import PasswordHash from '../../security/PasswordHash.js'
import LoginUserUseCase from '../LoginUserUseCase.js'
import NewAuth from '../../../Domains/authentications/entities/NewAuth.js'

describe('GetAuthenticationUseCase', () => {
    it('should orchestrating the get authentication action correctly', async () => {
        const payLoad = {
            username: 'dicoding',
            password: 'secret'
        }
        const mockedAuthentication = new NewAuth({
            accessToken: 'access_token',
            refreshToken: 'refresh_token'
        })
        const mockUserRepository = new UserRepository()
        const mockAuthenticationRepository = new AuthenticationRepository()
        const mockAuthenticationTokenManager = new AuthenticationTokenManager()
        const mockPasswordHash = new PasswordHash()

        mockUserRepository.getPasswordByUsername = jest.fn().mockImplementation(() => Promise.resolve('encrypted_password'))
        mockPasswordHash.comparePassword = jest.fn().mockImplementation(() => Promise.resolve())
        mockAuthenticationTokenManager.createAccessToken = jest.fn().mockImplementation(() => Promise.resolve(mockedAuthentication.accessToken))
        mockAuthenticationTokenManager.createRefreshToken = jest.fn().mockImplementation(() => Promise.resolve(mockedAuthentication.refreshToken))
        mockUserRepository.getIdByUsername = jest.fn().mockImplementation(() => Promise.resolve('user_id-123'))
        mockAuthenticationRepository.generateToken = jest.fn().mockImplementation(() => Promise.resolve())

        const loginUserUseCase = new LoginUserUseCase(mockUserRepository, mockAuthenticationRepository, mockAuthenticationTokenManager, mockPasswordHash)

        const actualAuthentication = await loginUserUseCase.execute(payLoad)

        expect(actualAuthentication).toEqual(new NewAuth({
            accessToken: 'access_token',
            refreshToken: 'refresh_token'
        }))
        expect(mockUserRepository.getPasswordByUsername).toBeCalledWith('dicoding')
        expect(mockPasswordHash.comparePassword).toBeCalledWith('secret', 'encrypted_password')
        expect(mockUserRepository.getIdByUsername).toBeCalledWith('dicoding')
        expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({ username: 'dicoding', id: 'user_id-123' })
        expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({ username: 'dicoding', id: 'user_id-123' })
        expect(mockAuthenticationRepository.generateToken).toBeCalledWith(mockedAuthentication.refreshToken)
    })
})
