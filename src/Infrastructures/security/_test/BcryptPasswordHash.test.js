import { jest, describe, it, expect } from '@jest/globals'
import bcrypt from 'bcrypt'
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js'
import BcryptEncryptionHelper from '../BcryptPasswordHash.js'

describe('BcryptEncryptionHelper', () => {
    describe('hash function', () => {
        it('should encrypt password correctly', async () => {
            const spyHash = jest.spyOn(bcrypt, 'hash')
            const bcryptEncryptionHelper = new BcryptEncryptionHelper(bcrypt)

            const encryptedPassword = await bcryptEncryptionHelper.hash('plain_password')

            expect(typeof encryptedPassword).toEqual('string')
            expect(encryptedPassword).not.toEqual('plain_password')
            expect(spyHash).toBeCalledWith('plain_password', 10)
        })
    })

    describe('comparePassword function', () => {
        it('should throw AuthenticationError if password not match', async () => {
            const bcryptEncryptionHelper = new BcryptEncryptionHelper(bcrypt)

            await expect(bcryptEncryptionHelper.comparePassword('plain_password', 'encrypted_password')).rejects.toThrow(AuthenticationError)
        })

        it('should not return AuthenticationError if password match', async () => {
            const bcryptEncryptionHelper = new BcryptEncryptionHelper(bcrypt)
            const plainPassword = 'secret'
            const encryptedPassword = await bcryptEncryptionHelper.hash(plainPassword)

            await expect(bcryptEncryptionHelper.comparePassword(plainPassword, encryptedPassword)).resolves.not.toThrow(AuthenticationError)
        })
    })
})
