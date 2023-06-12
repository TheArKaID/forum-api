import { jest, describe, it, expect } from '@jest/globals'
import bcrypt from 'bcrypt'
import AuthenticationError from '../../../Commons/exceptions/AuthenticationError.js'
import BcryptEncryptionHelper from '../BcryptPasswordHash.js'

describe('BcryptEncryptionHelper', () => {
    describe('hash function', () => {
        it('should encrypt password correctly', async () => {
            const spyHash = jest.spyOn(bcrypt, 'hash')
            const encryptionHelper = new BcryptEncryptionHelper(bcrypt)

            const EncryptedPass = await encryptionHelper.hash('plain_password')

            expect(typeof EncryptedPass).toEqual('string')
            expect(EncryptedPass).not.toEqual('plain_password')
            expect(spyHash).toBeCalledWith('plain_password', 10)
        })
    })

    describe('comparePassword function', () => {
        it('should throw AuthenticationError if password not match', async () => {
            const encryptionHelper = new BcryptEncryptionHelper(bcrypt)

            await expect(encryptionHelper.comparePassword('plain_password', 'encrypted_password')).rejects.toThrow(AuthenticationError)
        })

        it('should not return AuthenticationError if password match', async () => {
            const encryptionHelper = new BcryptEncryptionHelper(bcrypt)

            const plainPass = 'secret'
            const EncryptedPass = await encryptionHelper.hash(plainPass)

            await expect(encryptionHelper.comparePassword(plainPass, EncryptedPass)).resolves.not.toThrow(AuthenticationError)
        })
    })
})
