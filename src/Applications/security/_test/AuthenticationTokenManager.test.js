import { describe, it, expect } from '@jest/globals'
import AuthenticationTokenManager from '../AuthenticationTokenManager.js'

describe('AuthenticationTokenManager interface', () => {
    it('should throw error when invoke unimplemented method', async () => {
        const tokenManager = new AuthenticationTokenManager()

        await expect(tokenManager.createAccessToken('')).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
        await expect(tokenManager.createRefreshToken('')).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
        await expect(tokenManager.verifyRefreshToken('')).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
        await expect(tokenManager.decodePayload('')).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
    })
})
