import { describe, it, expect } from '@jest/globals'
import ThreadRepository from '../ThreadRepository.js'

describe('ThreadRepository interface', () => {
    it('should throw error when invoke unimplemented method', async () => {
        const threadRepository = new ThreadRepository()

        await expect(threadRepository.addThread({}, '')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(threadRepository.getThreadById('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
})
