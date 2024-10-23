/* eslint-disable no-undef */
const AddedThread = require('../../../Domains/threads/entities/AddedThread')
const AddThread = require('../../../Domains/threads/entities/AddThread')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'lorem ipsum dolor sit amet',
      body: 'lorem ipsum dolor sit amet',
      owner: 'user-123'
    }

    const expectedAddedThread = new AddedThread({
      id: 'id-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner
    })

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(
        expectedAddedThread
      ))

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    })

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload)

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread)
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner
    }))
  })
})
