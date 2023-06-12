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
        const payLoad = {
            content: 'A Reply of Comment'
        }
        const fakeOwnerId = 'user_id-123'
        const fakeThreadId = 'thread_id-123'
        const fakeCommentId = 'comment_id-123'
        const expectedAddedReply = new AddedReply({
            id: 'reply_id-123',
            owner: fakeOwnerId,
            content: payLoad.content
        })

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockReplyRepository = new ReplyRepository()

        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new DetailThread({
            id: fakeThreadId,
            title: 'A Thread',
            body: 'A Thread Body',
            date: '2021-08-08T07:22:33.555Z',
            username: 'dicoding'
        })))
        mockCommentRepository.checkCommentById = jest.fn(() => Promise.resolve())
        mockReplyRepository.createReply = jest.fn(() => Promise.resolve(expectedAddedReply))

        const replyUseCase = new ReplyUseCase(mockThreadRepository, mockCommentRepository, mockReplyRepository)

        const reply = await replyUseCase.createReply(payLoad, fakeThreadId, fakeCommentId, fakeOwnerId)

        expect(reply).toStrictEqual(expectedAddedReply)
        expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThreadId)
        expect(mockCommentRepository.checkCommentById).toBeCalledWith(fakeCommentId)
        expect(mockReplyRepository.createReply).toBeCalledWith(new NewReply({
            content: payLoad.content
        }), fakeCommentId, fakeOwnerId)
    })

    it('should orchestrating the delete reply action correctly', async () => {
        const fakeOwnerId = 'user_id-123'
        const fakeThreadId = 'thread_id-123'
        const fakeCommentId = 'comment_id-123'
        const fakeReply = 'reply_id-123'

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockReplyRepository = new ReplyRepository()

        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new DetailThread({
            id: fakeThreadId,
            title: 'A Thread',
            body: 'A Thread Body',
            date: '2021-08-08T07:22:33.555Z',
            username: 'dicoding'
        })))
        mockCommentRepository.checkCommentById = jest.fn(() => Promise.resolve())
        mockReplyRepository.checkReplyOwner = jest.fn(() => Promise.resolve())
        mockReplyRepository.deleteReplyById = jest.fn(() => Promise.resolve())

        const replyUseCase = new ReplyUseCase(mockThreadRepository, mockCommentRepository, mockReplyRepository)
        await replyUseCase.deleteReplyById(fakeThreadId, fakeCommentId, fakeReply, fakeOwnerId)

        expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThreadId)
        expect(mockCommentRepository.checkCommentById).toBeCalledWith(fakeCommentId)
        expect(mockReplyRepository.checkReplyOwner).toBeCalledWith(fakeReply, fakeOwnerId)
        expect(mockReplyRepository.deleteReplyById).toBeCalledWith(fakeReply)
    })
})
