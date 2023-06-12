import { expect, describe, it } from '@jest/globals'
import NewReply from '../NewReply.js'

describe('a NewReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
        }

        expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            content: true
        }

        expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create NewReply object correctly', () => {
        const payload = {
            content: 'A Reply of Comment'
        }

        const { content } = new NewReply(payload)

        expect(content).toEqual(payload.content)
    })
})
