/* istanbul ignore file */

import { createContainer } from 'instances-container'

// external agency
import { nanoid } from 'nanoid'
import bcrypt from 'bcrypt'
import jwt from '@hapi/jwt'
import pool from './database/postgres/pool.js'

// service (repository, helper, manager, etc)
import UserRepository from '../Domains/users/UserRepository.js'
import PasswordHash from '../Applications/security/PasswordHash.js'
import UserRepositoryPostgres from './repository/UserRepositoryPostgres.js'
import BcryptPasswordHash from './security/BcryptPasswordHash.js'
import ThreadRepository from '../Domains/threads/ThreadRepository.js'
import ThreadRepositoryPostgres from './repository/ThreadRepositoryPostgres.js'
import CommentRepository from '../Domains/comments/CommentRepository.js'
import CommentRepositoryPostgres from './repository/CommentRepositoryPostgres.js'
import ReplyRepository from '../Domains/replies/ReplyRepository.js'
import ReplyRepositoryPostgres from './repository/ReplyRepositoryPostgres.js'
import LikeCommentRepository from '../Domains/likeComments/LikeCommentRepository.js'
import LikeCommentRepositoryPostgres from './repository/LikeCommentRepositoryPostgres.js'
import AuthenticationRepository from '../Domains/authentications/AuthenticationRepository.js'
import AuthenticationRepositoryPostgres from './repository/AuthenticationRepositoryPostgres.js'
import AuthenticationTokenManager from '../Applications/security/AuthenticationTokenManager.js'
import JwtTokenManager from './security/JwtTokenManager.js'

// use case
import AddUserUseCase from '../Applications/use_case/AddUserUseCase.js'
import LoginUserUseCase from '../Applications/use_case/LoginUserUseCase.js'
import LogoutUserUseCase from '../Applications/use_case/LogoutUserUseCase.js'
import RefreshAuthenticationUseCase from '../Applications/use_case/RefreshAuthenticationUseCase.js'
import ThreadUseCase from '../Applications/use_case/ThreadUseCase.js'
import CommentUseCase from '../Applications/use_case/CommentUseCase.js'
import ReplyUseCase from '../Applications/use_case/ReplyUseCase.js'
import LikeCommentUseCase from '../Applications/use_case/LikeCommentUseCase.js'

// creating container
const container = createContainer()

// registering services and repository
container.register([
    {
        key: UserRepository.name,
        Class: UserRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: pool
                },
                {
                    concrete: nanoid
                }
            ]
        }
    },
    {
        key: AuthenticationRepository.name,
        Class: AuthenticationRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: pool
                }
            ]
        }
    },
    {
        key: PasswordHash.name,
        Class: BcryptPasswordHash,
        parameter: {
            dependencies: [
                {
                    concrete: bcrypt
                }
            ]
        }
    },
    {
        key: AuthenticationTokenManager.name,
        Class: JwtTokenManager,
        parameter: {
            dependencies: [
                {
                    concrete: jwt.token
                }
            ]
        }
    }, {
        key: ThreadRepository.name,
        Class: ThreadRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: pool
                },
                {
                    concrete: nanoid
                }
            ]
        }
    },
    {
        key: CommentRepository.name,
        Class: CommentRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: pool
                },
                {
                    concrete: nanoid
                }
            ]
        }
    },
    {
        key: ReplyRepository.name,
        Class: ReplyRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: pool
                },
                {
                    concrete: nanoid
                }
            ]
        }
    },
    {
        key: LikeCommentRepository.name,
        Class: LikeCommentRepositoryPostgres,
        parameter: {
            dependencies: [
                {
                    concrete: pool
                },
                {
                    concrete: nanoid
                }
            ]
        }
    }
])

// registering use cases
container.register([
    {
        key: AddUserUseCase.name,
        Class: AddUserUseCase,
        parameter: {
            injectType: 'parameter',
            dependencies: [
                {
                    internal: UserRepository.name
                },
                {
                    internal: PasswordHash.name
                }
            ]
        }
    },
    {
        key: LoginUserUseCase.name,
        Class: LoginUserUseCase,
        parameter: {
            injectType: 'parameter',
            dependencies: [
                {
                    internal: UserRepository.name
                },
                {
                    internal: AuthenticationRepository.name
                },
                {
                    internal: AuthenticationTokenManager.name
                },
                {
                    internal: PasswordHash.name
                }
            ]
        }
    },
    {
        key: LogoutUserUseCase.name,
        Class: LogoutUserUseCase,
        parameter: {
            injectType: 'parameter',
            dependencies: [
                {
                    internal: AuthenticationRepository.name
                }
            ]
        }
    },
    {
        key: RefreshAuthenticationUseCase.name,
        Class: RefreshAuthenticationUseCase,
        parameter: {
            injectType: 'parameter',
            dependencies: [
                {
                    internal: AuthenticationRepository.name
                },
                {
                    internal: AuthenticationTokenManager.name
                }
            ]
        }
    },
    {
        key: ThreadUseCase.name,
        Class: ThreadUseCase,
        parameter: {
            injectType: 'parameter',
            dependencies: [
                {
                    internal: ThreadRepository.name
                },
                {
                    internal: CommentRepository.name
                },
                {
                    internal: ReplyRepository.name
                },
                {
                    internal: LikeCommentRepository.name
                }
            ]
        }
    },
    {
        key: CommentUseCase.name,
        Class: CommentUseCase,
        parameter: {
            injectType: 'parameter',
            dependencies: [
                {
                    internal: ThreadRepository.name
                },
                {
                    internal: CommentRepository.name
                }
            ]
        }
    },
    {
        key: ReplyUseCase.name,
        Class: ReplyUseCase,
        parameter: {
            injectType: 'parameter',
            dependencies: [
                {
                    internal: ThreadRepository.name
                },
                {
                    internal: CommentRepository.name
                },
                {
                    internal: ReplyRepository.name
                }
            ]
        }
    },
    {
        key: LikeCommentUseCase.name,
        Class: LikeCommentUseCase,
        parameter: {
            injectType: 'parameter',
            dependencies: [
                {
                    internal: ThreadRepository.name
                },
                {
                    internal: CommentRepository.name
                },
                {
                    internal: LikeCommentRepository.name
                }
            ]
        }
    }
])

export default container
