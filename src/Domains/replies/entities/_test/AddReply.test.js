/* eslint-disable no-undef */
const AddReply = require('../AddReply')

describe('AddReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'lorem ipsum'
    }

    // Action & Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload has invalid data type', () => {
    // Arrange
    const payload = {
      content: true,
      owner: 123,
      comment: 'comment-123'
    }

    // Action & Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'lorem ipsum',
      owner: 'user-123',
      comment: 'comment-123'
    }

    // Action
    const addReply = new AddReply(payload)

    // Assert
    expect(addReply.content).toEqual(payload.content)
    expect(addReply.owner).toEqual(payload.owner)
    expect(addReply.comment).toEqual(payload.comment)
  })
})
