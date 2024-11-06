const AddLike = require('../../Domains/likes/entities/AddLike')

class AddLikeUseCase {
  constructor ({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._likeRepository = likeRepository
  }

  async execute (useCasePayload) {
    await this._threadRepository.verifyAvailableThread(useCasePayload.thread)
    await this._commentRepository.verifyAvailableComment(useCasePayload.comment)
    const liked = await this._likeRepository.verifyLikeStatus(useCasePayload.comment, useCasePayload.owner)
    if (!liked) {
      const like = new AddLike(useCasePayload)
      await this._likeRepository.like(like)
    } else {
      await this._likeRepository.unlike(useCasePayload.comment, useCasePayload.owner)
    }
  }
}

module.exports = AddLikeUseCase
