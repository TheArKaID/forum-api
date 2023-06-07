import { jest, describe, it, expect } from '@jest/globals'
import NewComment from '../../../Domains/comments/entities/NewComment.js'
import AddedComment from '../../../Domains/comments/entities/AddedComment.js'
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js'
import CommentRepository from '../../../Domains/comments/CommentRepository.js'
import CommentUseCase from '../CommentUseCase.js'
import DetailThread from '../../../Domains/threads/entities/DetailThread.js'

describe('CommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        const useCasePayload = {
            content: 'A New Comment'
        }
        const fakeOwner = 'user_id-123'
        const fakeThread = 'thread_id-123'
        const expectedAddedComment = new AddedComment({
            id: 'comment_id-123',
            content: useCasePayload.content,
            owner: fakeOwner
        })

        /** dependency of use case */
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        /** mocking function */
        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new DetailThread({
            id: fakeThread,
            title: 'A Thread',
            body: 'A Thread Body',
            date: '2023-05-18T18:17:02.329Z',
            username: 'dicoding'
        })))
        mockCommentRepository.addComment = jest.fn(() => Promise.resolve(new AddedComment({
            id: 'comment_id-123',
            content: useCasePayload.content,
            owner: fakeOwner
        })))

        /** use case instance */
        const commentUseCase = new CommentUseCase(mockThreadRepository, mockCommentRepository)

        const comment = await commentUseCase.addComment(useCasePayload, fakeThread, fakeOwner)

        expect(comment).toStrictEqual(expectedAddedComment)
        expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThread)
        expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
            content: useCasePayload.content
        }), fakeThread, fakeOwner)
    })

    it('should orchestrating the delete comment action correctly', async () => {
        const fakeOwner = 'user_id-123'
        const fakeThread = 'thread_id-123'
        const fakeComment = 'comment_id-123'

        /** dependency of use case */
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()

        /** mocking function */
        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new DetailThread({
            id: fakeThread,
            title: 'A Thread',
            body: 'A Thread Body',
            date: '2023-05-18T18:17:02.329Z',
            username: 'dicoding'
        })))
        mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve())
        mockCommentRepository.deleteCommentById = jest.fn(() => Promise.resolve())

        /** use case instance */
        const commentUseCase = new CommentUseCase(mockThreadRepository, mockCommentRepository)

        await commentUseCase.deleteCommentById(fakeComment, fakeThread, fakeOwner)

        expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThread)
        expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(fakeComment, fakeOwner)
        expect(mockCommentRepository.deleteCommentById).toBeCalledWith(fakeComment)
    })
})
