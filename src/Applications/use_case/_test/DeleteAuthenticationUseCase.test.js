import { jest, describe, it, expect } from '@jest/globals'
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js'
import DeleteAuthenticationUseCase from '../DeleteAuthenticationUseCase.js'

describe('DeleteAuthenticationUseCase', () => {
    it('should throw error if use case payload not contain refresh token', async () => {
        const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({})

        await expect(deleteAuthenticationUseCase.execute({})).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
    })

    it('should throw error if refresh token not string', async () => {
        const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({})

        await expect(deleteAuthenticationUseCase.execute({
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

        const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase(mockAuthenticationRepository)

        await deleteAuthenticationUseCase.execute({
            refreshToken: 'refreshToken'
        })

        expect(mockAuthenticationRepository.checkToken).toHaveBeenCalledWith(payLoad.refreshToken)
        expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(payLoad.refreshToken)
    })
})
