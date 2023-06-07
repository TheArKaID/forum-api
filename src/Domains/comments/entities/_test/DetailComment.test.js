import { expect, describe, it } from '@jest/globals'
import DetailComment from '../DetailComment.js'

describe('a DetailComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            date: '2023-05-18T18:17:02.329Z',
            body: 'content'
        }

        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            username: 1234,
            date: '2023-05-18T18:17:02.329Z',
            content: 'content',
            isDeleted: 'true'
        }

        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should show detailComment object correctly', () => {
        const payload = {
            id: 'comment_id-123',
            username: 'dicoding',
            date: '2023-05-18T18:17:02.329Z',
            content: 'A New Comment',
            isDeleted: false
        }

        const detailComment = new DetailComment(payload)

        expect(detailComment.id).toEqual(payload.id)
        expect(detailComment.username).toEqual(payload.username)
        expect(detailComment.date).toEqual(payload.date)
        expect(detailComment.content).toEqual(payload.content)
    })

    it('should show detailComment object correctly when isDeleted is true', () => {
        const payload = {
            id: 'comment_id-123',
            username: 'dicoding',
            date: '2023-05-18T18:17:02.329Z',
            content: 'A New Comment',
            isDeleted: true
        }

        const detailComment = new DetailComment(payload)

        expect(detailComment.id).toEqual(payload.id)
        expect(detailComment.username).toEqual(payload.username)
        expect(detailComment.date).toEqual(payload.date)
        expect(detailComment.content).toEqual('**komentar telah dihapus**')
    })
})
