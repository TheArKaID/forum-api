import { expect, describe, it } from '@jest/globals'
import AddedReply from '../AddedReply.js'

describe('a AddedReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            owner: 'user_id-123',
            content: 'content'
        }

        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            owner: 1234,
            content: 'content'
        }

        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create newReply object correctly', () => {
        const payload = {
            id: 'reply_id-123',
            owner: 'user_id-123',
            content: 'A Reply of Comment'
        }

        const reply = new AddedReply(payload)

        expect(reply.id).toEqual(payload.id)
        expect(reply.content).toEqual(payload.content)
        expect(reply.owner).toEqual(payload.owner)
    })
})
