import { expect, describe, it } from '@jest/globals'
import AddedReply from '../AddedReply.js'

describe('a AddedReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            content: 'content',
            owner: 'user_id-123'
        }

        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            content: 'content',
            owner: 1234
        }

        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create newReply object correctly', () => {
        const payload = {
            id: 'reply_id-123',
            content: 'A Reply of Comment',
            owner: 'user_id-123'
        }

        const reply = new AddedReply(payload)

        expect(reply.id).toEqual(payload.id)
        expect(reply.content).toEqual(payload.content)
        expect(reply.owner).toEqual(payload.owner)
    })
})
