import { expect, describe, it, afterEach, afterAll } from '@jest/globals'
import pool from '../../database/postgres/pool.js'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js'
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js'
import container from '../../container.js'
import createServer from '../createServer.js'

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
        await RepliesTableTestHelper.cleanTable()
    })

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 201 and persisted reply', async () => {
            const payload = {
                content: 'A Reply of Comment'
            }
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})
            await ThreadsTableTestHelper.createThread({})
            await CommentsTableTestHelper.createComment({})

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread_id-123/comments/comment_id-123/replies',
                payload,
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        id: 'user_id-123'
                    }
                }
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.addedReply).toBeDefined()
        })

        it('should response 400 when request payload not contain needed property', async () => {
            const payload = {
            }
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})
            await ThreadsTableTestHelper.createThread({})
            await CommentsTableTestHelper.createComment({})

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread_id-123/comments/comment_id-123/replies',
                payload,
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        id: 'user_id-123'
                    }
                }
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Failed to reply, some property is not provided')
        })

        it('should response 400 when request payload not meet data type specification', async () => {
            const payload = {
                content: true
            }
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})
            await ThreadsTableTestHelper.createThread({})
            await CommentsTableTestHelper.createComment({})

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread_id-123/comments/comment_id-123/replies',
                payload,
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        id: 'user_id-123'
                    }
                }
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Failed to reply, some property has invalid data type')
        })

        it('should response 404 when thread not found', async () => {
            const payload = {
                content: 'A Reply of Comment'
            }
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})
            await ThreadsTableTestHelper.createThread({})
            await CommentsTableTestHelper.createComment({})

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread_id-1234/comments/comment_id-123/replies',
                payload,
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

        it('should response 404 when comment not found', async () => {
            const payload = {
                content: 'A Reply of Comment'
            }
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})
            await ThreadsTableTestHelper.createThread({})
            await CommentsTableTestHelper.createComment({})

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread_id-123/comments/comment_id-1234/replies',
                payload,
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
    })

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        it('should response 200 and deleted reply', async () => {
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})
            await ThreadsTableTestHelper.createThread({})
            await CommentsTableTestHelper.createComment({})
            await RepliesTableTestHelper.createReply({})

            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread_id-123/comments/comment_id-123/replies/reply_id-123',
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

        it('should response 403 when deleting reply not as the owner', async () => {
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})
            await ThreadsTableTestHelper.createThread({})
            await CommentsTableTestHelper.createComment({})
            await RepliesTableTestHelper.createReply({})

            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread_id-123/comments/comment_id-123/replies/reply_id-123',
                auth: {
                    strategy: 'forumapi_jwt',
                    credentials: {
                        id: 'user_id-1234'
                    }
                }
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(403)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Cannot access reply, you are not the owner')
        })

        it('should response 404 when thread not found', async () => {
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})

            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread_id-1234/comments/comment_id-123/replies/reply_id-123',
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

        it('should response 404 when comment not found', async () => {
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})
            await ThreadsTableTestHelper.createThread({})

            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread_id-123/comments/comment_id-123/replies/reply_id-123',
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

        it('should response 404 when reply not found', async () => {
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})
            await ThreadsTableTestHelper.createThread({})
            await CommentsTableTestHelper.createComment({})

            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread_id-123/comments/comment_id-123/replies/reply_id-123',
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
            expect(responseJson.message).toEqual('Reply not found')
        })
    })
})
