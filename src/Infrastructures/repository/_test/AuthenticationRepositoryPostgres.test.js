import { expect, describe, it, afterEach, afterAll } from '@jest/globals'
import InvariantError from '../../../Commons/exceptions/InvariantError.js'
import AuthenticationsTableTestHelper from '../../../../tests/AuthenticationsTableTestHelper.js'
import pool from '../../database/postgres/pool.js'
import AuthenticationRepositoryPostgres from '../AuthenticationRepositoryPostgres.js'

describe('AuthenticationRepository postgres', () => {
    afterEach(async () => {
        await AuthenticationsTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('generateToken function', () => {
        it('should add token to database', async () => {
            const authenticationRepository = new AuthenticationRepositoryPostgres(pool)
            const token = 'token'

            await authenticationRepository.generateToken(token)

            const tokens = await AuthenticationsTableTestHelper.getOneToken(token)
            expect(tokens).toHaveLength(1)
            expect(tokens[0].token).toBe(token)
        })
    })

    describe('checkToken function', () => {
        it('should throw InvariantError if token not available', async () => {
            const authenticationRepository = new AuthenticationRepositoryPostgres(pool)
            const token = 'token'

            await expect(authenticationRepository.checkToken(token)).rejects.toThrow(InvariantError)
        })

        it('should not throw InvariantError if token available', async () => {
            const authenticationRepository = new AuthenticationRepositoryPostgres(pool)
            const token = 'token'
            await AuthenticationsTableTestHelper.generateToken(token)

            await expect(authenticationRepository.checkToken(token)).resolves.not.toThrow(InvariantError)
        })
    })

    describe('deleteToken', () => {
        it('should delete token from database', async () => {
            const authenticationRepository = new AuthenticationRepositoryPostgres(pool)
            const token = 'token'
            await AuthenticationsTableTestHelper.generateToken(token)

            await authenticationRepository.deleteToken(token)

            const tokens = await AuthenticationsTableTestHelper.getOneToken(token)
            expect(tokens).toHaveLength(0)
        })
    })
})
