import { expect, describe, it, afterEach, afterAll } from '@jest/globals'
import pool from '../../database/postgres/pool.js'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import container from '../../container.js'
import createServer from '../createServer.js'

describe('/users endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable()
    })

    describe('when POST /users', () => {
        it('should response 201 and persisted user', async () => {
            const requestPayload = {
                username: 'dicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            }
            // eslint-disable-next-line no-undef
            const server = await createServer(container)

            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.addedUser).toBeDefined()
        })

        it('should response 400 when request payload not contain needed property', async () => {
            const requestPayload = {
                fullname: 'Dicoding Indonesia',
                password: 'secret'
            }
            const server = await createServer(container)

            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Failed to register user. All properties must be filled')
        })

        it('should response 400 when request payload not meet data type specification', async () => {
            const requestPayload = {
                username: 'dicoding',
                password: 'secret',
                fullname: ['Dicoding Indonesia']
            }
            const server = await createServer(container)

            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Failed to register user. Some property has invalid data type')
        })

        it('should response 400 when username more than 50 character', async () => {
            const requestPayload = {
                username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            }
            const server = await createServer(container)

            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Failed to register user. Username cannot contains more than 50 characters')
        })

        it('should response 400 when username contain restricted character', async () => {
            const requestPayload = {
                username: 'dicoding indonesia',
                password: 'secret',
                fullname: 'Dicoding Indonesia'
            }
            const server = await createServer(container)

            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang')
        })

        it('should response 400 when username unavailable', async () => {
            await UsersTableTestHelper.addUser({ username: 'dicoding' })
            const requestPayload = {
                username: 'dicoding',
                fullname: 'Dicoding Indonesia',
                password: 'super_secret'
            }
            const server = await createServer(container)

            const response = await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayload
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('username tidak tersedia')
        })
    })
})
