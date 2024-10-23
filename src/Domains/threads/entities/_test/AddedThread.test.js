/* eslint-disable no-undef */
const AddedThread = require('../AddedThread')

describe('AddedThread entity', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-1234',
      title: 'Lorem ipsum dolor sit amet'
    }

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload has invalid data type', () => {
    // Arrange
    const payload = {
      id: 'thread-1234',
      title: true,
      owner: {}
    }

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create AddedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Lorem ipsum dolor sit amet',
      owner: 'user-123'
    }

    // Action
    const addedThread = new AddedThread(payload)

    // Assert
    expect(addedThread.id).toEqual(payload.id)
    expect(addedThread.title).toEqual(payload.title)
    expect(addedThread.owner).toEqual(payload.owner)
  })
})
