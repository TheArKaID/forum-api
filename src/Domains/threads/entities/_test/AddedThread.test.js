import { expect, describe, it } from '@jest/globals'
import AddedThread from '../AddedThread.js'

describe('a AddedThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            owner: 'user_id-123',
            title: 'title'
        }

        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            owner: 1234,
            title: 'title'
        }

        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create newThread object correctly', () => {
        const payload = {
            id: 'thread_id-123',
            owner: 'user_id-123',
            title: 'The Title of the Thread'
        }

        const thread = new AddedThread(payload)

        expect(thread.id).toEqual(payload.id)
        expect(thread.title).toEqual(payload.title)
        expect(thread.owner).toEqual(payload.owner)
    })
})
