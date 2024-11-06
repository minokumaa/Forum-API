class AddLike {
  constructor (payload) {
    this._verifyPayload(payload)

    this.owner = payload.owner
    this.comment = payload.comment
  }

  _verifyPayload ({ owner, comment }) {
    if (!owner || !comment) {
      throw new Error('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof owner !== 'string' || typeof comment !== 'string') {
      throw new Error('ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddLike
