import { expect, describe, it, afterEach, afterAll } from '@jest/globals'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import InvariantError from '../../../Commons/exceptions/InvariantError.js'
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js'
import RegisteredUser from '../../../Domains/users/entities/RegisteredUser.js'
import pool from '../../database/postgres/pool.js'
import UserRepositoryPostgres from '../UserRepositoryPostgres.js'

describe('UserRepositoryPostgres', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable()
    })

    afterAll(async () => {
        await pool.end()
    })

    describe('checkUsername function', () => {
        it('should throw InvariantError when username not available', async () => {
            await UsersTableTestHelper.createUser({ username: 'dicoding' })
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

            await expect(userRepositoryPostgres.checkUsername('dicoding')).rejects.toThrowError(InvariantError)
        })

        it('should not throw InvariantError when username available', async () => {
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

            await expect(userRepositoryPostgres.checkUsername('dicoding')).resolves.not.toThrowError(InvariantError)
        })
    })

    describe('createUser function', () => {
        it('should add a register user and return registered user correctly', async () => {
            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'secret_password',
                fullname: 'Dicoding Indonesia'
            })
            const generateID = () => '123'
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, generateID)

            await userRepositoryPostgres.createUser(registerUser)

            const users = await UsersTableTestHelper.findUsersById('user_id-123')
            expect(users).toHaveLength(1)
        })

        it('should return registered user correctly', async () => {
            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'secret_password',
                fullname: 'Dicoding Indonesia'
            })
            const generateID = () => '123'
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, generateID)

            const registeredUser = await userRepositoryPostgres.createUser(registerUser)

            expect(registeredUser).toStrictEqual(new RegisteredUser({
                id: 'user_id-123',
                username: 'dicoding',
                fullname: 'Dicoding Indonesia'
            }))
        })
    })

    describe('getPasswordByUsername', () => {
        it('should throw InvariantError when user not found', () => {
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

            return expect(userRepositoryPostgres.getPasswordByUsername('dicoding')).rejects.toThrowError(InvariantError)
        })

        it('should return username password when user is found', async () => {
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})
            await UsersTableTestHelper.createUser({
                username: 'dicoding',
                password: 'secret_password'
            })

            const password = await userRepositoryPostgres.getPasswordByUsername('dicoding')
            expect(password).toBe('secret_password')
        })
    })

    describe('getIdByUsername', () => {
        it('should throw InvariantError when user not found', async () => {
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

            await expect(userRepositoryPostgres.getIdByUsername('dicoding')).rejects.toThrowError(InvariantError)
        })

        it('should return user id correctly', async () => {
            await UsersTableTestHelper.createUser({ id: 'user-321', username: 'dicoding' })
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

            const userId = await userRepositoryPostgres.getIdByUsername('dicoding')

            expect(userId).toEqual('user-321')
        })
    })
})
