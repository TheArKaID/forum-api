import { expect, describe, it } from '@jest/globals'
import AddedComment from '../AddedComment.js'

describe('a AddedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            content: 'content',
            owner: 'user_id-123'
        }

        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            content: 'content',
            owner: 1234
        }

        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should create newComment object correctly', () => {
        const payload = {
            id: 'comment_id-123',
            content: 'A New Comment',
            owner: 'user_id-123'
        }

        const comment = new AddedComment(payload)

        expect(comment.id).toEqual(payload.id)
        expect(comment.content).toEqual(payload.content)
        expect(comment.owner).toEqual(payload.owner)
    })
})
