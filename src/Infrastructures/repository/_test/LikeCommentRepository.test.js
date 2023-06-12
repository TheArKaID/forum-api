import { expect, describe, it, afterEach, afterAll } from '@jest/globals'
import pool from '../../database/postgres/pool.js'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js'
import LikesTableHelper from '../../../../tests/LikeCommentsTableHelper.js'
import LikeCommentRepositoryPostgres from '../LikeCommentRepositoryPostgres.js'
import LikeCommentRepository from '../../../Domains/likeComments/LikeCommentRepository.js'

describe('LikeCommentRepositoryPostgres', () => {
    it('should be instance of LikeCommentRepository domain', () => {
        const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres({}, {})

        expect(likeCommentRepositoryPostgres).toBeInstanceOf(LikeCommentRepository)
    })

    describe('behavior test', () => {
        afterEach(async () => {
            await UsersTableTestHelper.cleanTable()
            await ThreadsTableTestHelper.cleanTable()
            await CommentsTableTestHelper.cleanTable()
            await LikesTableHelper.cleanTable()
        })

        afterAll(async () => {
            await pool.end()
        })

        describe('checkLikeComment function', () => {
            it('should return false when like doesnt exist', async () => {
                const generateID = () => '123'
                const fakeOwnerId = 'user_id-123'
                const fakeCommentId = 'comment_id-123'
                const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, generateID)

                const like = await likeCommentRepositoryPostgres.checkLikeComment(fakeCommentId, fakeOwnerId)

                expect(like).toBeFalsy()
            })

            it('should return true when like exist', async () => {
                const generateID = () => '123'
                const fakeOwnerId = 'user_id-123'
                const fakeCommentId = 'comment_id-123'

                const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.createUser({})
                await ThreadsTableTestHelper.createThread({})
                await CommentsTableTestHelper.createComment({})
                await LikesTableHelper.likeComment({})

                const like = await likeCommentRepositoryPostgres.checkLikeComment(fakeCommentId, fakeOwnerId)

                expect(like).toBeTruthy()
            })
        })

        describe('likeComment function', () => {
            it('should like the comment', async () => {
                const generateID = () => '123'
                const fakeOwnerId = 'user_id-123'
                const fakeCommentId = 'comment_id-123'

                const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.createUser({})
                await ThreadsTableTestHelper.createThread({})
                await CommentsTableTestHelper.createComment({})

                await likeCommentRepositoryPostgres.likeComment(fakeCommentId, fakeOwnerId)

                const like = await LikesTableHelper.getLikeCountByCommentId('comment_id-123')

                expect(like).toBe(1)
            })
        })

        describe('unlikeComment function', () => {
            it('should unlike the comment', async () => {
                const generateID = () => '123'
                const fakeOwnerId = 'user_id-123'
                const fakeCommentId = 'comment_id-123'
                const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.createUser({})
                await ThreadsTableTestHelper.createThread({})
                await CommentsTableTestHelper.createComment({})
                await LikesTableHelper.likeComment({})

                const unlikeComment = await likeCommentRepositoryPostgres.unlikeComment(fakeCommentId, fakeOwnerId)

                expect(unlikeComment).toBe()
            })
        })

        describe('getLikeCountByCommentId function', () => {
            it('should return like count of a comment', async () => {
                const generateID = () => '123'
                const fakeCommentId = 'comment_id-123'
                const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.createUser({})
                await ThreadsTableTestHelper.createThread({})
                await CommentsTableTestHelper.createComment({})
                await LikesTableHelper.likeComment({})

                const likeCount = await likeCommentRepositoryPostgres.getLikeCountByCommentId(fakeCommentId)

                expect(likeCount).toBe(1)
            })
        })
    })
})
