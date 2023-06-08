import { jest, describe, it, expect } from '@jest/globals'
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js'
import CommentRepository from '../../../Domains/comments/CommentRepository.js'
import LikeRepository from '../../../Domains/likes/LikeRepository.js'
import LikeUseCase from '../LikeUseCase.js'
import DetailThread from '../../../Domains/threads/entities/DetailThread.js'

describe('LikeUseCase', () => {
    it('should orchestrating like comment action correctly', async () => {
        const fakeOwner = 'user_id-123'
        const fakeThread = 'thread_id_id-123'
        const fakeComment = 'comment_id_id-123'

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockLikeRepository = new LikeRepository()

        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new DetailThread({
            id: fakeThread,
            title: 'A Thread',
            body: 'A Thread Body',
            date: '2023-05-18T18:17:02.329Z',
            username: 'dicoding'
        })))
        mockCommentRepository.checkCommentById = jest.fn(() => Promise.resolve())

        mockLikeRepository.checkLikeComment = jest.fn(() => Promise.resolve())
        mockLikeRepository.likeComment = jest.fn(() => Promise.resolve())

        const likeUseCase = new LikeUseCase(mockThreadRepository, mockCommentRepository, mockLikeRepository)

        await likeUseCase.likeComment(fakeThread, fakeComment, fakeOwner)

        expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThread)
        expect(mockCommentRepository.checkCommentById).toBeCalledWith(fakeComment)
        expect(mockLikeRepository.likeComment).toBeCalledWith(fakeComment, fakeOwner)
    })

    it('should orchestrating unlike comment action correctly', async () => {
        const fakeOwner = 'user_id-123'
        const fakeThread = 'thread_id-123'
        const fakeComment = 'comment_id-123'

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockLikeRepository = new LikeRepository()

        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new DetailThread({
            id: fakeThread,
            title: 'A Thread',
            body: 'A Thread Body',
            date: '2023-05-18T18:17:02.329Z',
            username: 'dicoding'
        })))
        mockCommentRepository.checkCommentById = jest.fn(() => Promise.resolve())

        mockLikeRepository.checkLikeComment = jest.fn(() => Promise.resolve(1))
        mockLikeRepository.unlikeComment = jest.fn(() => Promise.resolve())

        const likeUseCase = new LikeUseCase(mockThreadRepository, mockCommentRepository, mockLikeRepository)

        await likeUseCase.likeComment(fakeThread, fakeComment, fakeOwner)

        expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThread)
        expect(mockCommentRepository.checkCommentById).toBeCalledWith(fakeComment)
        expect(mockLikeRepository.unlikeComment).toBeCalledTimes(1)
    })
})
