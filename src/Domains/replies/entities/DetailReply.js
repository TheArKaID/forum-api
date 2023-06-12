class DetailReply {
    constructor (payload) {
        this._verifyPayload(payload)

        this.id = payload.id
        this.username = payload.username
        this.date = payload.date
        if (payload.isDeleted) {
            this.content = '**balasan telah dihapus**'
        } else {
            this.content = payload.content
        }
    }

    _verifyPayload (payload) {
        const { id, username, date, content, isDeleted } = payload
        if (!id || !username || !date || !content || isDeleted === undefined) {
            throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
        }

        if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof isDeleted !== 'boolean') {
            throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
        }
    }
}

export default DetailReply
