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
        const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {}) // dummy dependency

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

        describe('addReply function', () => {
            it('should add a new reply and return this reply correctly', async () => {
                const newReply = new NewReply({
                    content: 'A Reply of Comment'
                })
                const generateID = () => '123'
                const fakeOwner = 'user_id-123'
                const fakeComment = 'comment_id-123'
                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.addUser({})
                await ThreadsTableTestHelper.addThread({})
                await CommentsTableTestHelper.addComment({})

                const addedReply = await replyRepositoryPostgres.addReply(newReply, fakeComment, fakeOwner)

                const reply = await RepliesTableTestHelper.findReplyById('reply_id-123')
                expect(addedReply).toStrictEqual(new AddedReply({
                    id: 'reply_id-123',
                    content: 'A Reply of Comment',
                    owner: fakeOwner
                }))
                expect(reply).toHaveLength(1)
            })
        })

        describe('verifyReplyOwner function', () => {
            it('should throw NotFoundError when reply doesnt exist', async () => {
                const generateID = () => '123'
                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, generateID)

                const verifyReplyOwner = replyRepositoryPostgres.verifyReplyOwner('reply_id-1234', 'user_id-123')

                await expect(verifyReplyOwner).rejects.toThrowError(NotFoundError)
            })

            it('should throw AuthorizationError when replying not as the owner', async () => {
                const generateID = () => '123'
                const fakeReply = 'reply_id-123'
                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.addUser({})
                await ThreadsTableTestHelper.addThread({})
                await CommentsTableTestHelper.addComment({})
                await RepliesTableTestHelper.addReply({})

                const verifyReplyOwner = replyRepositoryPostgres.verifyReplyOwner(fakeReply, 'user_id-1234')

                await expect(verifyReplyOwner).rejects.toThrowError(AuthorizationError)
            })

            it('should return when replying as the owner', async () => {
                const generateID = () => '123'
                const fakeOwner = 'user_id-123'
                const fakeReply = 'reply_id-123'
                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.addUser({})
                await ThreadsTableTestHelper.addThread({})
                await CommentsTableTestHelper.addComment({})
                await RepliesTableTestHelper.addReply({})

                const verifyReplyOwner = await replyRepositoryPostgres.verifyReplyOwner(fakeReply, fakeOwner)

                expect(verifyReplyOwner).toBe()
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

                await UsersTableTestHelper.addUser({})
                await ThreadsTableTestHelper.addThread({})
                await CommentsTableTestHelper.addComment({})
                await RepliesTableTestHelper.addReply({})

                const result = await replyRepositoryPostgres.deleteReplyById(fakeReply)

                expect(result).toBe()
            })
        })

        describe('getRepliesByCommentId function', () => {
            it('should add a get replies by thread id and return detail replies correctly', async () => {
                const commentId = 'comment_id-123'
                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

                await UsersTableTestHelper.addUser({})
                await ThreadsTableTestHelper.addThread({})
                await CommentsTableTestHelper.addComment({ createdAt: '2023-05-18T18:17:02.329Z' })
                await RepliesTableTestHelper.addReply({ createdAt: '2023-05-18T18:17:02.329Z' })

                const detailReplies = await replyRepositoryPostgres.getRepliesByCommentId(commentId)

                const replies = await RepliesTableTestHelper.findRepliesByCommentId('comment_id-123')
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
