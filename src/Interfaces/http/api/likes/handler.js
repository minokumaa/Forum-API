const AddLikeUseCase = require('../../../../Applications/use_case/AddLikeUseCase')

class LikesHandler {
  constructor (container) {
    this._container = container
  }

  async putLikeComment ({ params, auth }, h) {
    const likeCommentUseCase = this._container.getInstance(AddLikeUseCase.name)
    const { threadId, commentId } = params
    const { id: credentialId } = auth.credentials
    const payloadSend = { owner: credentialId, thread: threadId, comment: commentId }

    await likeCommentUseCase.execute(payloadSend)
    const response = h.response({
      status: 'success'
    })
    response.code(200)
    return response
  }
}

module.exports = LikesHandler
