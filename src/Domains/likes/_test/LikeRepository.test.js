import { describe, it, expect } from '@jest/globals'
import LikeRepository from '../LikeRepository.js'

describe('LikeRepository interface', () => {
    it('should throw error when invoke unimplemented method', async () => {
        const likeRepository = new LikeRepository()

        await expect(likeRepository.checkLikeComment('', '')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(likeRepository.likeComment('', '')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(likeRepository.getLikeCountByCommentId('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(likeRepository.unlikeComment('', '')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
})
