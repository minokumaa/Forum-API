class AddReply {
  constructor (payload) {
    this._verifyPayload(payload)

    this.content = payload.content
    this.owner = payload.owner
    this.comment = payload.comment
    this.thread = payload.thread
  }

  _verifyPayload ({ content, owner, comment }) {
    if (!content || !owner || !comment) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof comment !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddReply
