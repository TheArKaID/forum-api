import { jest, describe, it, expect } from '@jest/globals'
import jwt from '@hapi/jwt'
import InvariantError from '../../../Commons/exceptions/InvariantError.js'
import JwtTokenManager from '../JwtTokenManager.js'

describe('JwtTokenManager', () => {
    describe('createAccessToken function', () => {
        it('should create accessToken correctly', async () => {
            const payload = {
                username: 'dicoding'
            }
            const mockJwtToken = {
                generate: jest.fn().mockImplementation(() => 'mock_token')
            }
            const jwtTokenManager = new JwtTokenManager(mockJwtToken)

            const accessToken = await jwtTokenManager.createAccessToken(payload)

            expect(mockJwtToken.generate).toBeCalledWith(payload, process.env.ACCESS_TOKEN_KEY)
            expect(accessToken).toEqual('mock_token')
        })
    })

    describe('createRefreshToken function', () => {
        it('should create refreshToken correctly', async () => {
            const payload = {
                username: 'dicoding'
            }
            const mockJwtToken = {
                generate: jest.fn().mockImplementation(() => 'mock_token')
            }
            const jwtTokenManager = new JwtTokenManager(mockJwtToken)

            const refreshToken = await jwtTokenManager.createRefreshToken(payload)

            expect(mockJwtToken.generate).toBeCalledWith(payload, process.env.REFRESH_TOKEN_KEY)
            expect(refreshToken).toEqual('mock_token')
        })
    })

    describe('checkRefreshToken function', () => {
        it('should throw InvariantError when verification failed', async () => {
            const jwtTokenManager = new JwtTokenManager(jwt.token)
            const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' })

            await expect(jwtTokenManager.checkRefreshToken(accessToken)).rejects.toThrow(InvariantError)
        })

        it('should not throw InvariantError when refresh token verified', async () => {
            const jwtTokenManager = new JwtTokenManager(jwt.token)
            const refreshToken = await jwtTokenManager.createRefreshToken({ username: 'dicoding' })

            await expect(jwtTokenManager.checkRefreshToken(refreshToken)).resolves.not.toThrow(InvariantError)
        })
    })

    describe('decodePayload function', () => {
        it('should decode payload correctly', async () => {
            const jwtTokenManager = new JwtTokenManager(jwt.token)
            const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' })

            const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken)

            expect(expectedUsername).toEqual('dicoding')
        })
    })
})
