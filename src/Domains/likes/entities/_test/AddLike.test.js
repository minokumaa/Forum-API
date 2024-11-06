/* eslint-disable no-undef */
const AddLike = require('../AddLike')

describe('AddLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action & Assert')
    expect(() => new AddLike(payload)).toThrowError('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload has invalid data type', () => {
    // Arrange
    const payload = {
      owner: true,
      comment: []
    }

    // Action & Assert
    expect(() => new AddLike(payload)).toThrowError('ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddComment object correctly', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
      comment: 'comment-123'
    }

    // Action
    const addComment = new AddLike(payload)

    // Assert
    expect(addComment.owner).toEqual(payload.owner)
    expect(addComment.comment).toEqual(payload.comment)
  })
})
