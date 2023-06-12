import { expect, describe, it, afterEach, afterAll } from '@jest/globals'
import pool from '../../database/postgres/pool.js'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js'
import container from '../../container.js'
import createServer from '../createServer.js'
import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js'

describe('/authentications endpoint', () => {
    afterAll(async () => {
        await pool.end()
    })

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable()
        await AuthenticationsTableTestHelper.cleanTable()
    })

    describe('when POST /authentications', () => {
        it('should response 201 and new authentication', async () => {
            const requestPayload = {
                username: 'dicoding',
                password: 'secret'
            }
            const server = await createServer(container)

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia'
                }
            })

            const response = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestPayload
            })

            const responseJson = JSON.parse(response.payload)

            expect(response.statusCode).toEqual(201)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.accessToken).toBeDefined()
            expect(responseJson.data.refreshToken).toBeDefined()
        })

        it('should response 400 if username not found', async () => {
            const requestPayload = {
                username: 'dicoding',
                password: 'secret'
            }
            const server = await createServer(container)

            const response = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestPayload
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Username not found')
        })

        it('should response 401 if password wrong', async () => {
            const requestPayload = {
                username: 'dicoding',
                password: 'wrong_password'
            }
            const server = await createServer(container)

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia'
                }
            })

            const response = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestPayload
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(401)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('kredensial yang Anda masukkan salah')
        })

        it('should response 400 if login payload not contain needed property', async () => {
            const requestPayload = {
                username: 'dicoding'
            }
            const server = await createServer(container)

            const response = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestPayload
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Failed to login user. All properties must be filled')
        })

        it('should response 400 if login payload wrong data type', async () => {
            const requestPayload = {
                username: 123,
                password: 'secret'
            }
            const server = await createServer(container)

            const response = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestPayload
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Failed to login user. Some property has invalid data type')
        })
    })

    describe('when PUT /authentications', () => {
        it('should return 200 and new access token', async () => {
            const server = await createServer(container)

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                    fullname: 'Dicoding Indonesia'
                }
            })

            const loginResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'dicoding',
                    password: 'secret'
                }
            })
            const { data: { refreshToken } } = JSON.parse(loginResponse.payload)

            const response = await server.inject({
                method: 'PUT',
                url: '/authentications',
                payload: {
                    refreshToken
                }
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
            expect(responseJson.data.accessToken).toBeDefined()
        })

        it('should return 400 when payload not contain refresh token', async () => {
            const server = await createServer(container)

            const response = await server.inject({
                method: 'PUT',
                url: '/authentications',
                payload: {}
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Failed to refresh authentication because refresh token not contain')
        })

        it('should return 400 when refresh token not string', async () => {
            const server = await createServer(container)

            const response = await server.inject({
                method: 'PUT',
                url: '/authentications',
                payload: {
                    refreshToken: 123
                }
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Failed to refresh authentication because refresh token not string')
        })

        it('should return 400 when refresh token not valid', async () => {
            const server = await createServer(container)

            const response = await server.inject({
                method: 'PUT',
                url: '/authentications',
                payload: {
                    refreshToken: 'invalid_refresh_token'
                }
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('refresh token tidak valid')
        })

        it('should return 400 when refresh token not registered in database', async () => {
            const server = await createServer(container)
            const refreshToken = await container.getInstance(AuthenticationTokenManager.name).createRefreshToken({ username: 'dicoding' })

            const response = await server.inject({
                method: 'PUT',
                url: '/authentications',
                payload: {
                    refreshToken
                }
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('refresh token tidak ditemukan di database')
        })
    })

    describe('when DELETE /authentications', () => {
        it('should response 200 if refresh token valid', async () => {
            const server = await createServer(container)
            const refreshToken = 'refresh_token'
            await AuthenticationsTableTestHelper.generateToken(refreshToken)

            const response = await server.inject({
                method: 'DELETE',
                url: '/authentications',
                payload: {
                    refreshToken
                }
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(200)
            expect(responseJson.status).toEqual('success')
        })

        it('should response 400 if refresh token not registered in database', async () => {
            const server = await createServer(container)
            const refreshToken = 'refresh_token'

            const response = await server.inject({
                method: 'DELETE',
                url: '/authentications',
                payload: {
                    refreshToken
                }
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('refresh token tidak ditemukan di database')
        })

        it('should response 400 if payload not contain refresh token', async () => {
            const server = await createServer(container)

            const response = await server.inject({
                method: 'DELETE',
                url: '/authentications',
                payload: {}
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Failed to delete authentication because refresh token not contain')
        })

        it('should response 400 if refresh token not string', async () => {
            const server = await createServer(container)

            const response = await server.inject({
                method: 'DELETE',
                url: '/authentications',
                payload: {
                    refreshToken: 123
                }
            })

            const responseJson = JSON.parse(response.payload)
            expect(response.statusCode).toEqual(400)
            expect(responseJson.status).toEqual('fail')
            expect(responseJson.message).toEqual('Failed to delete authentication because refresh token not string')
        })
    })
})
