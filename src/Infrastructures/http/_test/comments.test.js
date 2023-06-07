import { expect, describe, it, afterEach, afterAll } from '@jest/globals'
import pool from '../../database/postgres/pool.js'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js'
import container from '../../container.js'
import createServer from '../createServer.js'

describe('/threads/{threadId}/comments endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
    })

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 201 and persisted comment', async () => {
            const payload = {
                content: 'A New Comment'
            }
            const server = await createServer(container)

            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread_id-123/comments',
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
            expect(responseJson.data.addedComment).toBeDefined()
        })

        it('should response 400 when request payload not contain needed property', async () => {
            const payload = {
            }
            const server = await createServer(container)

            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread_id-123/comments',
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
            expect(responseJson.message).toEqual('Failed to comment, some property is not provided')
        })

        it('should response 400 when request payload not meet data type specification', async () => {
            const payload = {
                content: true
            }
            const server = await createServer(container)

            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread_id-123/comments',
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
            expect(responseJson.message).toEqual('Failed to comment, some property has invalid data type')
        })

        it('should response 404 when thread not found', async () => {
            const payload = {
                content: 'A New Comment'
            }
            const server = await createServer(container)

            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread_id-1234/comments',
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
    })

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response 200 and deleted comment', async () => {
            const server = await createServer(container)

            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})
            await CommentsTableTestHelper.addComment({})

            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread_id-123/comments/comment_id-123',
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

        it('should response 403 when commenting not as the owner', async () => {
            const server = await createServer(container)

            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})
            await CommentsTableTestHelper.addComment({})

            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread_id-123/comments/comment_id-123',
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
            expect(responseJson.message).toEqual('Cannot delete comment, you are not the owner')
        })

        it('should response 404 when thread not found', async () => {
            const server = await createServer(container)

            await UsersTableTestHelper.addUser({})

            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread_id-1234/comments/comment_id-123',
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

            await UsersTableTestHelper.addUser({})
            await ThreadsTableTestHelper.addThread({})

            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread_id-123/comments/comment_id-123',
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
})
