import { describe, it, expect } from '@jest/globals'
import LikeCommentRepository from '../LikeCommentRepository.js'

describe('LikeCommentRepository interface', () => {
    it('should throw error when invoke unimplemented method', async () => {
        const likeCommentRepository = new LikeCommentRepository()

        await expect(likeCommentRepository.checkLikeComment('', '')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(likeCommentRepository.likeComment('', '')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(likeCommentRepository.getLikeCountByCommentId('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(likeCommentRepository.unlikeComment('', '')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
})
