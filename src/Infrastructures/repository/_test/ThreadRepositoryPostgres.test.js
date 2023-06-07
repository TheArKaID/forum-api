import { expect, describe, it, afterEach, afterAll } from '@jest/globals'
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js'
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js'
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js'
import NewThread from '../../../Domains/threads/entities/NewThread.js'
import AddedThread from '../../../Domains/threads/entities/AddedThread.js'
import DetailThread from '../../../Domains/threads/entities/DetailThread.js'
import pool from '../../database/postgres/pool.js'
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js'
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js'

describe('ThreadRepositoryPostgres', () => {
    it('should be instance of ThreadRepository domain', () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {}) // dummy dependency

        expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository)
    })

    describe('behavior test', () => {
        afterEach(async () => {
            await UsersTableTestHelper.cleanTable()
            await ThreadsTableTestHelper.cleanTable()
        })

        afterAll(async () => {
            await pool.end()
        })

        describe('addThread function', () => {
            it('should add a new thread and return this thread correctly', async () => {
                const newThread = new NewThread({
                    title: 'The Title of the Thread',
                    body: 'The Body of the Thread'
                })
                const generateID = () => '123'
                const fakeOwner = 'user_id-123'
                const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, generateID)

                await UsersTableTestHelper.addUser({})

                const thread = await threadRepositoryPostgres.addThread(newThread, fakeOwner)

                const threads = await ThreadsTableTestHelper.findThreadsById('thread_id-123')
                expect(thread).toStrictEqual(new AddedThread({
                    id: 'thread_id-123',
                    title: 'The Title of the Thread',
                    owner: fakeOwner
                }))
                expect(threads).toHaveLength(1)
            })
        })

        describe('getThreadById function', () => {
            it('should throw NotFoundError when thread doesnt exist', async () => {
                const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

                const detailThread = threadRepositoryPostgres.getThreadById('thread_id-1234')

                await expect(detailThread).rejects.toThrowError(NotFoundError)
            })

            it('should add a get thread by id and return detail thread correctly', async () => {
                const threadId = 'thread_id-123'
                const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

                await UsersTableTestHelper.addUser({})
                await ThreadsTableTestHelper.addThread({ createdAt: '2023-05-17T18:17:02.329Z' })

                const detailThread = await threadRepositoryPostgres.getThreadById(threadId)

                const threads = await ThreadsTableTestHelper.findThreadsById('thread_id-123')
                expect(detailThread).toStrictEqual(new DetailThread({
                    id: threadId,
                    title: 'The Title of the Thread',
                    body: 'The Body of the Thread',
                    date: '2023-05-17T18:17:02.329Z',
                    username: 'dicoding'
                }))
                expect(threads).toHaveLength(1)
            })
        })
    })
})
