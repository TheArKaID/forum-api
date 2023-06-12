import { expect, describe, it, afterEach, afterAll } from '@jest/globals'
import pool from '../../database/postgres/pool.js'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js'
import LikesTableHelper from '../../../../tests/LikeCommentsTableHelper.js'
import container from '../../container.js'
import createServer from '../createServer.js'

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
        await LikesTableHelper.cleanTable()
    })

    describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
        it('should response 404 if thread not found', async () => {
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})
            await ThreadsTableTestHelper.createThread({})
            await CommentsTableTestHelper.createComment({})

            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread_id-1234/comments/comment_id-123/likes',
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        id: 'user_id-123'
                    }
                }
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Thread not found')
        })

        it('should response 404 if comment not found', async () => {
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})
            await ThreadsTableTestHelper.createThread({})
            await CommentsTableTestHelper.createComment({})

            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread_id-123/comments/comment_id-1234/likes',
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        id: 'user_id-123'
                    }
                }
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Comment not found')
        })

        it('should response 200 and like comment', async () => {
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})
            await ThreadsTableTestHelper.createThread({})
            await CommentsTableTestHelper.createComment({})

            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread_id-123/comments/comment_id-123/likes',
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        id: 'user_id-123'
                    }
                }
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
        })

        it('should response 200 and unlike comment', async () => {
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})
            await ThreadsTableTestHelper.createThread({})
            await CommentsTableTestHelper.createComment({})
            await LikesTableHelper.likeComment({})

            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread_id-123/comments/comment_id-123/likes',
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        id: 'user_id-123'
                    }
                }
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
        })
    })
})
