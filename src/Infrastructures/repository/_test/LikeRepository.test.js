import { expect, describe, it, afterEach, afterAll } from '@jest/globals'
import pool from '../../database/postgres/pool.js'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js'
import LikesTableHelper from '../../../../tests/LikesTableHelper.js'
import LikeRepositoryPostgres from '../LikeRepositoryPostgres.js'
import LikeRepository from '../../../Domains/likes/LikeRepository.js'

describe('LikeRepositoryPostgres', () => {
    it('should be instance of LikeRepository domain', () => {
        const likeRepositoryPostgres = new LikeRepositoryPostgres({}, {})

        expect(likeRepositoryPostgres).toBeInstanceOf(LikeRepository)
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
                const fakeOwner = 'user_id-123'
                const fakeComment = 'comment_id-123'
                const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, generateID)

                const like = await likeRepositoryPostgres.checkLikeComment(fakeComment, fakeOwner)

                expect(like).toBeFalsy()
            })

            it('should return true when like exist', async () => {
                const generateID = () => '123'
                const fakeOwner = 'user_id-123'
                const fakeComment = 'comment_id-123'

                const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.addUser({})
                await ThreadsTableTestHelper.addThread({})
                await CommentsTableTestHelper.addComment({})
                await LikesTableHelper.likeComment({})

                const like = await likeRepositoryPostgres.checkLikeComment(fakeComment, fakeOwner)

                expect(like).toBeTruthy()
            })
        })

        describe('likeComment function', () => {
            it('should like the comment', async () => {
                const generateID = () => '123'
                const fakeOwner = 'user_id-123'
                const fakeComment = 'comment_id-123'

                const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.addUser({})
                await ThreadsTableTestHelper.addThread({})
                await CommentsTableTestHelper.addComment({})

                await likeRepositoryPostgres.likeComment(fakeComment, fakeOwner)

                const like = await LikesTableHelper.getLikeCountByCommentId('comment_id-123')

                expect(like).toBe(1)
            })
        })

        describe('unlikeComment function', () => {
            it('should unlike the comment', async () => {
                const generateID = () => '123'
                const fakeOwner = 'user_id-123'
                const fakeComment = 'comment_id-123'
                const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.addUser({})
                await ThreadsTableTestHelper.addThread({})
                await CommentsTableTestHelper.addComment({})
                await LikesTableHelper.likeComment({})

                const unlikeComment = await likeRepositoryPostgres.unlikeComment(fakeComment, fakeOwner)

                expect(unlikeComment).toBe()
            })
        })

        describe('getLikeCountByCommentId function', () => {
            it('should return like count of a comment', async () => {
                const generateID = () => '123'
                const fakeComment = 'comment_id-123'
                const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.addUser({})
                await ThreadsTableTestHelper.addThread({})
                await CommentsTableTestHelper.addComment({})
                await LikesTableHelper.likeComment({})

                const likeCount = await likeRepositoryPostgres.getLikeCountByCommentId(fakeComment)

                expect(likeCount).toBe(1)
            })
        })
    })
})
