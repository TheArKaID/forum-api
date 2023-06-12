import { expect, describe, it } from '@jest/globals'
import DetailReply from '../DetailReply.js'

describe('a DetailReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            date: '2023-05-18T18:17:02.329Z',
            content: 'content'
        }

        expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    })

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            username: 1234,
            date: '2023-05-18T18:17:02.329Z',
            content: 'content',
            isDeleted: 'true'
        }

        expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    })

    it('should show detailReply object correctly', () => {
        const payload = {
            id: 'reply_id-123',
            username: 'dicoding',
            date: '2023-05-18T18:17:02.329Z',
            content: 'A Reply of Comment',
            isDeleted: false
        }

        const detailReply = new DetailReply(payload)

        expect(detailReply.id).toEqual(payload.id)
        expect(detailReply.username).toEqual(payload.username)
        expect(detailReply.date).toEqual(payload.date)
        expect(detailReply.content).toEqual(payload.content)
    })

    it('should show detailReply object correctly when isDeleted is true', () => {
        const payload = {
            id: 'reply_id-123',
            username: 'dicoding',
            date: '2023-05-18T18:17:02.329Z',
            content: 'A Reply of Comment',
            isDeleted: true
        }

        const detailReply = new DetailReply(payload)

        expect(detailReply.id).toEqual(payload.id)
        expect(detailReply.username).toEqual(payload.username)
        expect(detailReply.date).toEqual(payload.date)
        expect(detailReply.content).toEqual('**balasan telah dihapus**')
    })
})
