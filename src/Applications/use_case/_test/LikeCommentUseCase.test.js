import { jest, describe, it, expect } from '@jest/globals'
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js'
import CommentRepository from '../../../Domains/comments/CommentRepository.js'
import LikeCommentRepository from '../../../Domains/likeComments/LikeCommentRepository.js'
import LikeCommentUseCase from '../LikeCommentUseCase.js'
import DetailThread from '../../../Domains/threads/entities/DetailThread.js'

describe('LikeCommentUseCase', () => {
    it('should orchestrating like comment action correctly', async () => {
        const fakeOwnerId = 'user_id-123'
        const fakeThreadId = 'thread_id_id-123'
        const fakeCommentId = 'comment_id_id-123'

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockLikeCommentRepository = new LikeCommentRepository()

        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new DetailThread({
            id: fakeThreadId,
            title: 'A Thread',
            body: 'A Thread Body',
            date: '2023-05-18T18:17:02.329Z',
            username: 'dicoding'
        })))
        mockCommentRepository.checkCommentById = jest.fn(() => Promise.resolve())

        mockLikeCommentRepository.checkLikeComment = jest.fn(() => Promise.resolve())
        mockLikeCommentRepository.likeComment = jest.fn(() => Promise.resolve())

        const likeCommentUseCase = new LikeCommentUseCase(mockThreadRepository, mockCommentRepository, mockLikeCommentRepository)

        await likeCommentUseCase.likeComment(fakeThreadId, fakeCommentId, fakeOwnerId)

        expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThreadId)
        expect(mockCommentRepository.checkCommentById).toBeCalledWith(fakeCommentId)
        expect(mockLikeCommentRepository.likeComment).toBeCalledWith(fakeCommentId, fakeOwnerId)
    })

    it('should orchestrating unlike comment action correctly', async () => {
        const fakeOwnerId = 'user_id-123'
        const fakeThreadId = 'thread_id-123'
        const fakeCommentId = 'comment_id-123'

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockLikeCommentRepository = new LikeCommentRepository()

        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new DetailThread({
            id: fakeThreadId,
            title: 'A Thread',
            body: 'A Thread Body',
            date: '2023-05-18T18:17:02.329Z',
            username: 'dicoding'
        })))
        mockCommentRepository.checkCommentById = jest.fn(() => Promise.resolve())

        mockLikeCommentRepository.checkLikeComment = jest.fn(() => Promise.resolve(1))
        mockLikeCommentRepository.unlikeComment = jest.fn(() => Promise.resolve())

        const likeCommentUseCase = new LikeCommentUseCase(mockThreadRepository, mockCommentRepository, mockLikeCommentRepository)

        await likeCommentUseCase.likeComment(fakeThreadId, fakeCommentId, fakeOwnerId)

        expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThreadId)
        expect(mockCommentRepository.checkCommentById).toBeCalledWith(fakeCommentId)
        expect(mockLikeCommentRepository.unlikeComment).toBeCalledTimes(1)
    })
})
