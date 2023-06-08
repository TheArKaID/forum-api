import { expect, describe, it } from '@jest/globals'
import createServer from '../createServer.js'

describe('HTTP server', () => {
    it('should response 404 when request unregistered route', async () => {
        const server = await createServer({})

        const response = await server.inject({
            method: 'GET',
            url: '/unregisteredRoute'
        })

        expect(response.statusCode).toEqual(404)
    })

    it('should handle server error correctly', async () => {
        const requestPayload = {
            username: 'dicoding',
            fullname: 'Dicoding Indonesia',
            password: 'super_secret'
        }
        const server = await createServer({}) // fake injection

        const response = await server.inject({
            method: 'POST',
            url: '/users',
            payload: requestPayload
        })

        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(500)
        expect(responseJson.status).toEqual('error')
        expect(responseJson.message).toEqual('Server error. Please contact the administrator.')
    })
})

describe('when GET /', () => {
    it('should return 200 and say hi', async () => {
        const server = await createServer({})

        const response = await server.inject({
            method: 'GET',
            url: '/'
        })

        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toEqual(200)
        expect(responseJson.value).toEqual('Hi Forum API!')
    })
})
