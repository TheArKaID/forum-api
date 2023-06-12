import { jest, describe, it, expect } from '@jest/globals'
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js'
import LogoutUserUseCase from '../LogoutUserUseCase.js'

describe('LogoutUserUseCase', () => {
    it('should throw error if use case payload not contain refresh token', async () => {
        const logoutUserUseCase = new LogoutUserUseCase({})

        await expect(logoutUserUseCase.execute({})).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
    })

    it('should throw error if refresh token not string', async () => {
        const logoutUserUseCase = new LogoutUserUseCase({})

        await expect(logoutUserUseCase.execute({
            refreshToken: 123
        })).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should orchestrating the delete authentication action correctly', async () => {
        const payLoad = {
            refreshToken: 'refreshToken'
        }
        const mockAuthenticationRepository = new AuthenticationRepository()
        mockAuthenticationRepository.checkToken = jest.fn().mockImplementation(() => Promise.resolve())
        mockAuthenticationRepository.deleteToken = jest.fn().mockImplementation(() => Promise.resolve())

        const logoutUserUseCase = new LogoutUserUseCase(mockAuthenticationRepository)

        await logoutUserUseCase.execute({
            refreshToken: 'refreshToken'
        })

        expect(mockAuthenticationRepository.checkToken).toHaveBeenCalledWith(payLoad.refreshToken)
        expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(payLoad.refreshToken)
    })
})
