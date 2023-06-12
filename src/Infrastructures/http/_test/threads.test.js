import { expect, describe, it, afterEach, afterAll } from '@jest/globals'
import pool from '../../database/postgres/pool.js'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js'
import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js'
import container from '../../container.js'
import createServer from '../createServer.js'

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
    })

    describe('when POST /threads', () => {
        it('should response 201 and persisted thread', async () => {
            const payload = {
                title: 'The Title of the Thread',
                body: 'The Body of the Thread'
            }
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
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
            expect(responseJson.data.addedThread).toBeDefined()
        })

        it('should response 400 when request payload not contain needed property', async () => {
            const payload = {
                title: 'The Title of the Thread'
            }
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
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
            expect(responseJson.message).toEqual('Failed to create thread, some property is not provided')
        })

        it('should response 400 when request payload not meet data type specification', async () => {
            const payload = {
                title: 'The Title of the Thread',
                body: true
            }
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})

            const response = await server.inject({
                method: 'POST',
                url: '/threads',
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
            expect(responseJson.message).toEqual('Failed to create thread, some property has invalid data type')
        })
    })

    describe('when GET /threads/{threadId}', () => {
        it('should response 200 and get detail thread', async () => {
            const server = await createServer(container)

            await UsersTableTestHelper.createUser({})
            await ThreadsTableTestHelper.createThread({})
            await CommentsTableTestHelper.createComment({})
            await RepliesTableTestHelper.createReply({})

            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread_id-123'
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.thread).toBeDefined()
            expect(responseJson.data.thread.comments).toBeDefined()
            expect(responseJson.data.thread.comments[0].replies).toBeDefined()
        })

        it('should response 404 when thread not found', async () => {
            const server = await createServer(container)

            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread_id-1234'
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(404)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Thread not found')
        })
    })
})
