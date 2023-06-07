import InvariantError from './InvariantError.js'

const DomainErrorTranslator = {
    translate (error) {
        return DomainErrorTranslator._directories[error.message] || error
    }
}

DomainErrorTranslator._directories = {
    'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('Failed to register user. All properties must be filled'),
    'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Failed to register user. Some property has invalid data type'),
    'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('Failed to register user. Username cannot contains more than 50 characters'),
    'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
    'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('Failed to login user. All properties must be filled'),
    'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Failed to login user. Some property has invalid data type'),
    'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('Failed to refresh authentication because refresh token not contain'),
    'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Failed to refresh authentication because refresh token not string'),
    'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('Failed to delete authentication because refresh token not contain'),
    'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Failed to delete authentication because refresh token not string'),

    // Thread
    'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('Failed to create thread, some property is not provided'),
    'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Failed to create thread, some property has invalid data type'),

    // Comment
    'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('Failed to comment, some property is not provided'),
    'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Failed to comment, some property has invalid data type'),

    // Reply
    'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('Failed to reply, some property is not provided'),
    'NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('Failed to reply, some property has invalid data type')
}

export default DomainErrorTranslator
