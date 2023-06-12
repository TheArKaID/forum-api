import { expect, describe, it } from '@jest/globals'
import DetailThread from '../DetailThread.js'

describe('a DetailThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'title',
            body: 'body',
            date: '2023-05-18T18:17:02.329Z'
        }

        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            title: 'title',
            body: 'body',
            date: '2023-05-18T18:17:02.329Z',
            username: 1234
        }

        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should show detailThread object correctly', () => {
        const payload = {
            id: 'thread_id-123',
            title: 'The Title of the Thread',
            body: 'The Body of the Thread',
            date: '2023-05-18T18:17:02.329Z',
            username: 'dicoding'
        }

        const detailThread = new DetailThread(payload)

        expect(detailThread.id).toEqual(payload.id)
        expect(detailThread.title).toEqual(payload.title)
        expect(detailThread.body).toEqual(payload.body)
        expect(detailThread.date).toEqual(payload.date)
        expect(detailThread.username).toEqual(payload.username)
    })
})
