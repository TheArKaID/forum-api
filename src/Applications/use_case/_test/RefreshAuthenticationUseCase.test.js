import { jest, describe, it, expect } from '@jest/globals'
import AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js'
import AuthenticationTokenManager from '../../security/AuthenticationTokenManager.js'
import RefreshAuthenticationUseCase from '../RefreshAuthenticationUseCase.js'

describe('RefreshAuthenticationUseCase', () => {
    it('should throw error if use case payload not contain refresh token', async () => {
        const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({})

        await expect(refreshAuthenticationUseCase.execute({})).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
    })

    it('should throw error if refresh token not string', async () => {
        const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({})

        await expect(refreshAuthenticationUseCase.execute({
            refreshToken: 1
        })).rejects.toThrowError('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should orchestrating the refresh authentication action correctly', async () => {
        const payLoad = {
            refreshToken: 'some_refresh_token'
        }
        const mockAuthenticationRepository = new AuthenticationRepository()
        const mockAuthenticationTokenManager = new AuthenticationTokenManager()

        mockAuthenticationRepository.checkToken = jest.fn().mockImplementation(() => Promise.resolve())
        mockAuthenticationTokenManager.checkRefreshToken = jest.fn().mockImplementation(() => Promise.resolve())
        mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve({ username: 'dicoding', id: 'user_id-123' }))
        mockAuthenticationTokenManager.createAccessToken = jest.fn().mockImplementation(() => Promise.resolve('some_new_access_token'))

        const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase(mockAuthenticationRepository, mockAuthenticationTokenManager)

        const accessToken = await refreshAuthenticationUseCase.execute({
            refreshToken: 'some_refresh_token'
        })

        expect(mockAuthenticationTokenManager.checkRefreshToken).toBeCalledWith(payLoad.refreshToken)
        expect(mockAuthenticationRepository.checkToken).toBeCalledWith(payLoad.refreshToken)
        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(payLoad.refreshToken)
        expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({ username: 'dicoding', id: 'user_id-123' })
        expect(accessToken).toEqual('some_new_access_token')
    })
})
