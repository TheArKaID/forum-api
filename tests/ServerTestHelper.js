/* istanbul ignore file */

import createServer from '../src/Infrastructures/http/createServer.js'
import container from '../src/Infrastructures/container.js'

const ServerTestHelper = {
    async getAccessToken () {
        const userPayload = {
            username: 'user',
            password: 'password',
            fullname: 'User'
        }
        const loginPayload = {
            username: 'user',
            password: 'password'
        }

        const server = await createServer(container)
        await server.inject({
            method: 'POST',
            url: '/users',
            payload: userPayload
        })

        const response = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: loginPayload
        })

        const responseJson = JSON.parse(response.payload)

        if (response.statusCode !== 201) {
            throw new Error('Gagal melakukan authentikasi')
        }

        return responseJson.data.accessToken
    }
}

export default ServerTestHelper
