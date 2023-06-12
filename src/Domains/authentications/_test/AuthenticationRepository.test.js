import { describe, it, expect } from '@jest/globals'
import AuthenticationRepository from '../AuthenticationRepository.js'

describe('AuthenticationRepository interface', () => {
    it('should throw error when invoke unimplemented method', async () => {
        const authenticationRepository = new AuthenticationRepository()

        await expect(authenticationRepository.generateToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(authenticationRepository.checkToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(authenticationRepository.deleteToken('')).rejects.toThrowError('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
})
