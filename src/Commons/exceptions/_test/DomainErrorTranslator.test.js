import { describe, it, expect } from '@jest/globals'
import DomainErrorTranslator from '../DomainErrorTranslator.js'
import InvariantError from '../InvariantError.js'

describe('DomainErrorTranslator', () => {
    it('should translate error correctly', () => {
        expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY'))).toStrictEqual(new InvariantError('Failed to register user. All properties must be filled'))
        expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'))).toStrictEqual(new InvariantError('Failed to register user. Some property has invalid data type'))
        expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR'))).toStrictEqual(new InvariantError('Failed to register user. Username cannot contains more than 50 characters'))
        expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER'))).toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'))
    })

    it('should translate error threads correctly', () => {
        expect(DomainErrorTranslator.translate(new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'))).toStrictEqual(new InvariantError('Failed to create thread, some property is not provided'))
        expect(DomainErrorTranslator.translate(new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'))).toStrictEqual(new InvariantError('Failed to create thread, some property has invalid data type'))
    })

    it('should return original error when error message is not needed to translate', () => {
        const error = new Error('some_error_message')

        const translatedError = DomainErrorTranslator.translate(error)

        expect(translatedError).toStrictEqual(error)
    })
})
