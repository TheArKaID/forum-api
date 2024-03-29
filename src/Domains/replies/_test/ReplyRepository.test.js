import { describe, it, expect } from '@jest/globals'
import ReplyRepository from '../ReplyRepository.js'

describe('ReplyRepository interface', () => {
    it('should throw error when invoke unimplemented method', async () => {
        const replyRepository = new ReplyRepository()

        await expect(replyRepository.createReply({}, '', '')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(replyRepository.checkReplyOwner('', '')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(replyRepository.deleteReplyById('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(replyRepository.getRepliesByCommentId('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    })
})
