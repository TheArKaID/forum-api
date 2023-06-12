import { expect, describe, it, afterEach, afterAll } from '@jest/globals'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js'
import CommentRepository from '../../../Domains/comments/CommentRepository.js'
import NewComment from '../../../Domains/comments/entities/NewComment.js'
import AddedComment from '../../../Domains/comments/entities/AddedComment.js'
import DetailComment from '../../../Domains/comments/entities/DetailComment.js'
import pool from '../../database/postgres/pool.js'
import CommentRepositoryPostgres from '../CommentRepositoryPostgres.js'
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js'
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js'

describe('CommentRepositoryPostgres', () => {
    it('should be instance of CommentRepository domain', () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres({}, {})

        expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository)
    })

    describe('behavior test', () => {
        afterEach(async () => {
            await UsersTableTestHelper.cleanTable()
            await ThreadsTableTestHelper.cleanTable()
            await CommentsTableTestHelper.cleanTable()
        })

        afterAll(async () => {
            await pool.end()
        })

        describe('createComment function', () => {
            it('should add a new comment and return this comment correctly', async () => {
                const newComment = new NewComment({
                    content: 'A New Comment'
                })
                const generateID = () => '123'
                const fakeOwnerId = 'user_id-123'
                const fakeThreadId = 'thread_id-123'
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.createUser({})
                await ThreadsTableTestHelper.createThread({})

                const comment = await commentRepositoryPostgres.createComment(newComment, fakeThreadId, fakeOwnerId)

                const comments = await CommentsTableTestHelper.checkCommentById('comment_id-123')
                expect(comment).toStrictEqual(new AddedComment({
                    id: 'comment_id-123',
                    owner: fakeOwnerId,
                    content: 'A New Comment'
                }))
                expect(comments).toHaveLength(1)
            })
        })

        describe('checkCommentbyOwnerId function', () => {
            it('should throw NotFoundError when comment doesnt exist', async () => {
                const generateID = () => '123'
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, generateID)

                const checkCommentbyOwnerId = commentRepositoryPostgres.checkCommentbyOwnerId('comment_id-1234', 'user_id-123')

                await expect(checkCommentbyOwnerId).rejects.toThrowError(NotFoundError)
            })

            it('should throw AuthorizationError when commenting not as the owner', async () => {
                const generateID = () => '123'
                const fakeCommentId = 'comment_id-123'
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.createUser({})
                await ThreadsTableTestHelper.createThread({})
                await CommentsTableTestHelper.createComment({})

                const checkCommentbyOwnerId = commentRepositoryPostgres.checkCommentbyOwnerId(fakeCommentId, 'user_id-1234')

                await expect(checkCommentbyOwnerId).rejects.toThrowError(AuthorizationError)
            })

            it('should return when commenting as the owner', async () => {
                const generateID = () => '123'
                const fakeOwnerId = 'user_id-123'
                const fakeCommentId = 'comment_id-123'
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.createUser({})
                await ThreadsTableTestHelper.createThread({})
                await CommentsTableTestHelper.createComment({})

                const checkCommentbyOwnerId = await commentRepositoryPostgres.checkCommentbyOwnerId(fakeCommentId, fakeOwnerId)

                expect(checkCommentbyOwnerId).toBe()
            })
        })

        describe('deleteCommentById function', () => {
            it('should throw NotFoundError when comment doesnt exist', async () => {
                const generateID = () => '123'
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, generateID)

                const result = commentRepositoryPostgres.deleteCommentById('comment_id-1234')

                await expect(result).rejects.toThrowError(NotFoundError)
            })

            it('should set is_deleted true when deleting comment as the owner', async () => {
                const generateID = () => '123'
                const fakeCommentId = 'comment_id-123'
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.createUser({})
                await ThreadsTableTestHelper.createThread({})
                await CommentsTableTestHelper.createComment({})

                const result = await commentRepositoryPostgres.deleteCommentById(fakeCommentId)

                expect(result).toBe()
            })
        })

        describe('getCommentsByThreadId function', () => {
            it('should add a get comments by thread id and return detail comments correctly', async () => {
                const threadId = 'thread_id-123'
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

                await UsersTableTestHelper.createUser({})
                await ThreadsTableTestHelper.createThread({})
                await CommentsTableTestHelper.createComment({ createdAt: '2023-05-18T18:17:02.329Z' })

                const detailComments = await commentRepositoryPostgres.getCommentsByThreadId(threadId)

                const comments = await CommentsTableTestHelper.findCommentsByThreadId('thread_id-123')
                expect(detailComments).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining(new DetailComment({
                            id: 'comment_id-123',
                            username: 'dicoding',
                            date: '2023-05-18T18:17:02.329Z',
                            content: 'A New Comment',
                            isDeleted: false
                        }))
                    ])
                )
                expect(comments).toHaveLength(1)
            })
        })

        describe('checkCommentById function', () => {
            it('should throw NotFoundError when comment doesnt exist', async () => {
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

                await expect(commentRepositoryPostgres.checkCommentById('comment_id-1234')).rejects.toThrowError(NotFoundError)
            })

            it('should not throw NotFoundError when comment exist', async () => {
                const commentId = 'comment_id-123'
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

                await UsersTableTestHelper.createUser({})
                await ThreadsTableTestHelper.createThread({})
                await CommentsTableTestHelper.createComment({ id: commentId, createdAt: '2023-05-18T18:17:02.329Z' })

                expect(commentRepositoryPostgres.checkCommentById(commentId)).resolves.not.toThrowError(NotFoundError)
            })
        })
    })
})
