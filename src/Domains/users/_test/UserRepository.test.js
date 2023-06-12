import { describe, it, expect } from '@jest/globals'
import UserRepository from '../UserRepository.js'

describe('UserRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        const userRepository = new UserRepository()

        await expect(userRepository.createUser({})).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(userRepository.checkUsername('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(userRepository.getPasswordByUsername('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(userRepository.getIdByUsername('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
})
