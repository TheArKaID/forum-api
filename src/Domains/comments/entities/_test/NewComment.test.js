import { expect, describe, it } from '@jest/globals'
import NewComment from '../NewComment.js'

describe('a NewComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
        }

        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            content: true
        }

        expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create NewComment object correctly', () => {
        const payload = {
            content: 'A New Comment'
        }

        const { content } = new NewComment(payload)

        expect(content).toEqual(payload.content)
    })
})
