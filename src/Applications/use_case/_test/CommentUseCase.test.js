import { jest, describe, it, expect } from '@jest/globals'
import NewComment from '../../../Domains/comments/entities/NewComment.js'
import AddedComment from '../../../Domains/comments/entities/AddedComment.js'
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js'
import CommentRepository from '../../../Domains/comments/CommentRepository.js'
import CommentUseCase from '../CommentUseCase.js'
import DetailThread from '../../../Domains/threads/entities/DetailThread.js'

describe('CommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        const payLoad = {
            content: 'A New Comment'
        }
        const fakeOwnerId = 'user_id-123'
        const fakeThreadId = 'thread_id-123'
        const expectedAddedComment = new AddedComment({
            id: 'comment_id-123',
            owner: fakeOwnerId,
            content: payLoad.content
        })

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new DetailThread({
            id: fakeThreadId,
            title: 'A Thread',
            body: 'A Thread Body',
            date: '2023-05-18T18:17:02.329Z',
            username: 'dicoding'
        })))
        mockCommentRepository.createComment = jest.fn(() => Promise.resolve(new AddedComment({
            id: 'comment_id-123',
            content: payLoad.content,
            owner: fakeOwnerId
        })))

        const commentUseCase = new CommentUseCase(mockThreadRepository, mockCommentRepository)

        const comment = await commentUseCase.createComment(payLoad, fakeThreadId, fakeOwnerId)

        expect(comment).toStrictEqual(expectedAddedComment)
        expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThreadId)
        expect(mockCommentRepository.createComment).toBeCalledWith(new NewComment({
            content: payLoad.content
        }), fakeThreadId, fakeOwnerId)
    })

    it('should orchestrating the delete comment action correctly', async () => {
        const fakeOwnerId = 'user_id-123'
        const fakeThreadId = 'thread_id-123'
        const fakeCommentId = 'comment_id-123'

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new DetailThread({
            id: fakeThreadId,
            title: 'A Thread',
            body: 'A Thread Body',
            date: '2023-05-18T18:17:02.329Z',
            username: 'dicoding'
        })))
        mockCommentRepository.checkCommentbyOwnerId = jest.fn(() => Promise.resolve())
        mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve())

        const commentUseCase = new CommentUseCase(mockThreadRepository, mockCommentRepository)

        await commentUseCase.deleteCommentById(fakeThreadId, fakeCommentId, fakeOwnerId)

        expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThreadId)
        expect(mockCommentRepository.checkCommentbyOwnerId).toBeCalledWith(fakeCommentId, fakeOwnerId)
        expect(mockCommentRepository.deleteCommentById).toBeCalledWith(fakeCommentId)
    })
})
