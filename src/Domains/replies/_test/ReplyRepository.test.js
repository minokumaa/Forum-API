/* eslint-disable no-undef */
const ReplyRepository = require('../ReplyRepository')

describe('ReplyRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const replyRepository = new ReplyRepository()

    // Action & Assert
    await expect(replyRepository.addReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(replyRepository.deleteReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(replyRepository.verifyAvailableReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(replyRepository.verifyReplyOwner({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(replyRepository.getAllReplies({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
