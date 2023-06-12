import { jest, describe, it, expect } from '@jest/globals'
import NewThread from '../../../Domains/threads/entities/NewThread.js'
import AddedThread from '../../../Domains/threads/entities/AddedThread.js'
import DetailThread from '../../../Domains/threads/entities/DetailThread.js'
import DetailComment from '../../../Domains/comments/entities/DetailComment.js'
import DetailReply from '../../../Domains/replies/entities/DetailReply.js'
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js'
import CommentRepository from '../../../Domains/comments/CommentRepository.js'
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js'
import ThreadUseCase from '../ThreadUseCase.js'
import LikeCommentRepository from '../../../Domains/likeComments/LikeCommentRepository.js'

describe('ThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        const payLoad = {
            title: 'The Title of the Thread',
            body: 'The Body of the Thread'
        }
        const fakeOwnerId = 'user_id-123'
        const expectedAddedThread = new AddedThread({
            id: 'thread_id-123',
            owner: fakeOwnerId,
            title: payLoad.title
        })

        const mockThreadRepository = new ThreadRepository()

        mockThreadRepository.createThread = jest.fn(() => Promise.resolve(expectedAddedThread))

        const threadUseCase = new ThreadUseCase(mockThreadRepository)

        const thread = await threadUseCase.createThread(payLoad, fakeOwnerId)

        expect(thread).toStrictEqual(expectedAddedThread)
        expect(mockThreadRepository.createThread).toBeCalledWith(new NewThread({
            title: payLoad.title,
            body: payLoad.body
        }), fakeOwnerId)
    })

    it('should orchestrating the get thread action correctly', async () => {
        const fakeThreadId = 'thread_id-123'
        const fakeCommentId = 'comment_id-123'
        const threadPayload = {
            id: 'thread_id-123',
            title: 'The Title of the Thread',
            body: 'The Body of the Thread',
            date: '2023-05-18T18:17:02.329Z',
            username: 'dicoding'
        }
        const commentPayload = {
            id: 'comment_id-123',
            username: 'dicoding',
            date: '2023-05-18T18:17:02.329Z',
            content: 'A New Comment',
            isDeleted: false
        }
        const replyPayload = {
            id: 'reply_id-123',
            username: 'dicoding',
            date: '2023-05-18T18:17:02.329Z',
            content: 'A Reply of Comment',
            isDeleted: false
        }

        const expectedDetailThread = new DetailThread(threadPayload)
        const expectedDetailComment = [
            new DetailComment(commentPayload)
        ]
        const expectedDetailReply = [
            new DetailReply(replyPayload)
        ]

        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockReplyRepository = new ReplyRepository()
        const mockLikeCommentRepository = new LikeCommentRepository()

        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new DetailThread(threadPayload)))
        mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([new DetailComment(commentPayload)]))
        mockReplyRepository.getRepliesByCommentId = jest.fn(() => Promise.resolve([new DetailReply(replyPayload)]))
        mockLikeCommentRepository.getLikeCountByCommentId = jest.fn(() => Promise.resolve(1))

        const threadUseCase = new ThreadUseCase(mockThreadRepository, mockCommentRepository, mockReplyRepository, mockLikeCommentRepository)

        const thread = await threadUseCase.getThreadById(fakeThreadId)

        expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThreadId)
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(fakeThreadId)
        expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(fakeCommentId)

        expect(thread).toStrictEqual({
            ...expectedDetailThread,
            comments: [
                {
                    ...expectedDetailComment[0],
                    likeCount: 1,
                    replies: expectedDetailReply
                }
            ]
        })
    })
})
