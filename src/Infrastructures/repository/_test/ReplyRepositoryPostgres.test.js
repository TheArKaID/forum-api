import { expect, describe, it, afterEach, afterAll } from '@jest/globals'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js'
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js'
import ReplyRepositoryPostgres from '../ReplyRepositoryPostgres.js'
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js'
import pool from '../../database/postgres/pool.js'
import NewReply from '../../../Domains/replies/entities/NewReply.js'
import AddedReply from '../../../Domains/replies/entities/AddedReply.js'
import DetailReply from '../../../Domains/replies/entities/DetailReply.js'
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js'
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js'

describe('ReplyRepositoryPostgres', () => {
    it('should be instance of ReplyRepository domain', () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {})

        expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepository)
    })

    describe('behavior test', () => {
        afterEach(async () => {
            await UsersTableTestHelper.cleanTable()
            await ThreadsTableTestHelper.cleanTable()
            await CommentsTableTestHelper.cleanTable()
            await RepliesTableTestHelper.cleanTable()
        })

        afterAll(async () => {
            await pool.end()
        })

        describe('createReply function', () => {
            it('should add a new reply and return this reply correctly', async () => {
                const newReply = new NewReply({
                    content: 'A Reply of Comment'
                })
                const generateID = () => '123'
                const fakeOwnerId = 'user_id-123'
                const fakeCommentId = 'comment_id-123'
                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.createUser({})
                await ThreadsTableTestHelper.createThread({})
                await CommentsTableTestHelper.createComment({})

                const addedReply = await replyRepositoryPostgres.createReply(newReply, fakeCommentId, fakeOwnerId)

                const reply = await RepliesTableTestHelper.getReplyById('reply_id-123')

                expect(addedReply).toStrictEqual(new AddedReply({
                    id: 'reply_id-123',
                    owner: fakeOwnerId,
                    content: 'A Reply of Comment'
                }))
                expect(reply).toHaveLength(1)
            })
        })

        describe('checkReplyOwner function', () => {
            it('should throw NotFoundError when reply doesnt exist', async () => {
                const generateID = () => '123'
                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, generateID)

                const checkReplyOwner = replyRepositoryPostgres.checkReplyOwner('reply_id-1234', 'user_id-123')

                await expect(checkReplyOwner).rejects.toThrowError(NotFoundError)
            })

            it('should throw AuthorizationError when replying not as the owner', async () => {
                const generateID = () => '123'
                const fakeReply = 'reply_id-123'
                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.createUser({})
                await ThreadsTableTestHelper.createThread({})
                await CommentsTableTestHelper.createComment({})
                await RepliesTableTestHelper.createReply({})

                const checkReplyOwner = replyRepositoryPostgres.checkReplyOwner(fakeReply, 'user_id-1234')

                await expect(checkReplyOwner).rejects.toThrowError(AuthorizationError)
            })

            it('should return when replying as the owner', async () => {
                const generateID = () => '123'
                const fakeOwnerId = 'user_id-123'
                const fakeReply = 'reply_id-123'
                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.createUser({})
                await ThreadsTableTestHelper.createThread({})
                await CommentsTableTestHelper.createComment({})
                await RepliesTableTestHelper.createReply({})

                const checkReplyOwner = await replyRepositoryPostgres.checkReplyOwner(fakeReply, fakeOwnerId)

                expect(checkReplyOwner).toBe()
            })
        })

        describe('deleteReplyById function', () => {
            it('should throw NotFoundError when reply doesnt exist', async () => {
                const generateID = () => '123'
                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, generateID)

                const result = replyRepositoryPostgres.deleteReplyById('reply_id-1234')

                await expect(result).rejects.toThrowError(NotFoundError)
            })

            it('should set is_deleted true when deleting reply as the owner', async () => {
                const generateID = () => '123'
                const fakeReply = 'reply_id-123'
                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.createUser({})
                await ThreadsTableTestHelper.createThread({})
                await CommentsTableTestHelper.createComment({})
                await RepliesTableTestHelper.createReply({})

                const result = await replyRepositoryPostgres.deleteReplyById(fakeReply)

                expect(result).toBe()
            })
        })

        describe('getRepliesByCommentId function', () => {
            it('should add a get replies by thread id and return detail replies correctly', async () => {
                const commentId = 'comment_id-123'
                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

                await UsersTableTestHelper.createUser({})
                await ThreadsTableTestHelper.createThread({})
                await CommentsTableTestHelper.createComment({ createdAt: '2023-05-18T18:17:02.329Z' })
                await RepliesTableTestHelper.createReply({ createdAt: '2023-05-18T18:17:02.329Z' })

                const detailReplies = await replyRepositoryPostgres.getRepliesByCommentId(commentId)

                const replies = await RepliesTableTestHelper.getRepliesByCommentId('comment_id-123')
                expect(detailReplies).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(new DetailReply({
                            id: 'reply_id-123',
                            username: 'dicoding',
                            date: '2023-05-18T18:17:02.329Z',
                            content: 'A Reply of Comment',
                            isDeleted: false
                        }))
                    ])
                )
                expect(replies).toHaveLength(1)
            })
        })
    })
})
