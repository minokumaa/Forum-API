/* eslint-disable no-undef */
const AddedComment = require('../AddedComment')

describe('AddedComment entity', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload has invalid data type', () => {
    // Arrange
    const payload = {
      id: 123,
      content: true,
      owner: []
    }

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'lorem ipsum',
      owner: 'user-123'
    }

    // Action
    const addedComment = new AddedComment(payload)

    // Assert
    expect(addedComment.id).toEqual(payload.id)
    expect(addedComment.content).toEqual(payload.content)
    expect(addedComment.owner).toEqual(payload.owner)
  })
})
