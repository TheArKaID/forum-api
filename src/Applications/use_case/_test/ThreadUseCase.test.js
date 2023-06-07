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

describe('ThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        const useCasePayload = {
            title: 'The Title of the Thread',
            body: 'The Body of the Thread'
        }
        const fakeOwner = 'user_id-123'
        const expectedAddedThread = new AddedThread({
            id: 'thread_id-123',
            title: useCasePayload.title,
            owner: fakeOwner
        })

        /** dependency of use case */
        const mockThreadRepository = new ThreadRepository()

        /** mocking needed function */
        mockThreadRepository.addThread = jest.fn(() => Promise.resolve(expectedAddedThread))

        /** use case instance */
        const threadUseCase = new ThreadUseCase(mockThreadRepository)

        const thread = await threadUseCase.addThread(useCasePayload, fakeOwner)

        expect(thread).toStrictEqual(expectedAddedThread)
        expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
            title: useCasePayload.title,
            body: useCasePayload.body
        }), fakeOwner)
    })

    it('should orchestrating the get thread action correctly', async () => {
        const fakeThread = 'thread_id-123'
        const fakeComment = 'comment_id-123'
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

        /** dependency of use case */
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockReplyRepository = new ReplyRepository()

        /** mocking function */
        mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(new DetailThread(threadPayload)))
        mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([new DetailComment(commentPayload)]))
        mockReplyRepository.getRepliesByCommentId = jest.fn(() => Promise.resolve([new DetailReply(replyPayload)]))

        /** use case instance */
        const threadUseCase = new ThreadUseCase(mockThreadRepository, mockCommentRepository, mockReplyRepository)

        const thread = await threadUseCase.getThreadById(fakeThread)

        expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThread)
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(fakeThread)
        expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(fakeComment)

        expect(thread).toStrictEqual({
            ...expectedDetailThread,
            comments: [
                {
                    ...expectedDetailComment[0],
                    replies: expectedDetailReply
                }
            ]
        })
    })
})
