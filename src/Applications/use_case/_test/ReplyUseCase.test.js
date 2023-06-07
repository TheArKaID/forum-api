import { jest, describe, it, expect } from '@jest/globals'
import NewReply from '../../../Domains/replies/entities/NewReply.js'
import AddedReply from '../../../Domains/replies/entities/AddedReply.js'
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js'
import CommentRepository from '../../../Domains/comments/CommentRepository.js'
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js'
import ReplyUseCase from '../ReplyUseCase.js'
import DetailThread from '../../../Domains/threads/entities/DetailThread.js'

describe('ReplyUseCase', () => {
    it('should orchestrating the add reply action correctly', async () => {
        const useCasePayload = {
            content: 'A Reply of Comment'
        }
        const fakeOwner = 'user_id-123'
        const fakeThread = 'thread_id-123'
        const fakeComment = 'comment_id-123'
        const expectedAddedReply = new AddedReply({
            id: 'reply_id-123',
            content: useCasePayload.content,
            owner: fakeOwner
        })

        /** dependency of use case */
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockReplyRepository = new ReplyRepository()

        /** mocking function */
        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new DetailThread({
            id: fakeThread,
            title: 'A Thread',
            body: 'A Thread Body',
            date: '2021-08-08T07:22:33.555Z',
            username: 'dicoding'
        })))
        mockCommentRepository.checkCommentById = jest.fn(() => Promise.resolve())
        mockReplyRepository.addReply = jest.fn(() => Promise.resolve(expectedAddedReply))

        /** use case instance */
        const replyUseCase = new ReplyUseCase(mockThreadRepository, mockCommentRepository, mockReplyRepository)

        const reply = await replyUseCase.addReply(useCasePayload, fakeThread, fakeComment, fakeOwner)

        expect(reply).toStrictEqual(expectedAddedReply)
        expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThread)
        expect(mockCommentRepository.checkCommentById).toBeCalledWith(fakeComment)
        expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
            content: useCasePayload.content
        }), fakeComment, fakeOwner)
    })

    it('should orchestrating the delete reply action correctly', async () => {
        const fakeOwner = 'user_id-123'
        const fakeThread = 'thread_id-123'
        const fakeComment = 'comment_id-123'
        const fakeReply = 'reply_id-123'

        /** dependency of use case */
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockReplyRepository = new ReplyRepository()

        /** mocking function */
        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new DetailThread({
            id: fakeThread,
            title: 'A Thread',
            body: 'A Thread Body',
            date: '2021-08-08T07:22:33.555Z',
            username: 'dicoding'
        })))
        mockCommentRepository.checkCommentById = jest.fn(() => Promise.resolve())
        mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve())
        mockReplyRepository.deleteReplyById = jest.fn(() => Promise.resolve())

        /** use case instance */
        const replyUseCase = new ReplyUseCase(mockThreadRepository, mockCommentRepository, mockReplyRepository)
        await replyUseCase.deleteReplyById(fakeThread, fakeComment, fakeReply, fakeOwner)

        expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThread)
        expect(mockCommentRepository.checkCommentById).toBeCalledWith(fakeComment)
        expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(fakeReply, fakeOwner)
        expect(mockReplyRepository.deleteReplyById).toBeCalledWith(fakeReply)
    })
})
