/* eslint-disable no-undef */
const LikeRepository = require('../LikeRepository')

describe('LikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likeRepository = new LikeRepository()

    // Action & Assert
    await expect(likeRepository.like({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(likeRepository.unlike({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(likeRepository.verifyLikeStatus({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(likeRepository.getAllLikes({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
