import { expect, describe, it } from '@jest/globals'
import NewThread from '../NewThread.js'

describe('a NewThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            title: 'title'
        }

        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            title: 'title',
            body: true
        }

        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create NewThread object correctly', () => {
        const payload = {
            title: 'The Title of the Thread',
            body: 'The Body of the Thread'
        }

        const { title, body } = new NewThread(payload)

        expect(title).toEqual(payload.title)
        expect(body).toEqual(payload.body)
    })
})
