/* eslint-disable no-undef */
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const LikeRepository = require('../../../Domains/likes/LikeRepository')
const GetThreadUseCase = require('../GetThreadUseCase')

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123'
    }
    const thread = {
      id: 'thread-123',
      title: 'ini title thread',
      body: 'ini body thread',
      date: '20201010',
      username: 'winter'
    }
    const comments = [
      {
        id: 'comment-123',
        username: 'winter',
        date: '20211010',
        content: 'ini konten',
        is_deleted: false
      }
    ]

    const likes = [
      {
        id: 'like-123',
        owner: 'user-123',
        comment: 'comment-123'
      }
    ]

    const replies = [
      {
        id: 'reply-123',
        content: 'ini balasan komentar',
        date: '20211110',
        username: 'johndoe',
        comment: 'comment-123',
        is_deleted: false
      }
    ]

    const expectedThread = {
      id: 'thread-123',
      title: 'ini title thread',
      body: 'ini body thread',
      date: '20201010',
      username: 'winter',
      comments: [
        {
          id: 'comment-123',
          username: 'winter',
          date: '20211010',
          replies: [
            {
              id: 'reply-123',
              content: 'ini balasan komentar',
              date: '20211110',
              username: 'johndoe'
            }
          ],
          content: 'ini konten',
          likeCount: 1
        }
      ]
    }

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()
    const mockLikeRepository = new LikeRepository()

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread))
    mockCommentRepository.getAllCommentsInThread = jest.fn()
      .mockImplementation(() => Promise.resolve(comments))
    mockReplyRepository.getAllReplies = jest.fn()
      .mockImplementation(() => Promise.resolve(replies))
    mockLikeRepository.getAllLikes = jest.fn()
      .mockImplementation(() => Promise.resolve(likes))

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository
    })

    // Action
    const actualGetThread = await getThreadUseCase.execute(useCasePayload)

    // Assert
    expect(actualGetThread).toEqual(expectedThread)
    expect(mockThreadRepository.verifyAvailableThread)
      .toHaveBeenCalledWith(useCasePayload.threadId)
    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.getAllCommentsInThread)
      .toHaveBeenCalledWith(useCasePayload.threadId)
    expect(mockReplyRepository.getAllReplies)
      .toHaveBeenCalledWith(comments[0].id)
    expect(mockLikeRepository.getAllLikes)
      .toHaveBeenCalledWith(comments[0].id)
  })

  it('should return comments with content=**komentar telah dihapus** when comments has been deleted', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123'
    }
    const thread = {
      id: 'thread-123',
      title: 'ini title thread',
      body: 'ini body thread',
      date: '20201010',
      username: 'winter'
    }

    const comments = [
      {
        id: 'comment-123',
        username: 'winter',
        date: '20211010',
        content: 'ini konten',
        is_deleted: true
      }
    ]

    const likes = []

    const replies = [
      {
        id: 'reply-123',
        content: 'ini balasan komentar',
        date: '20211110',
        username: 'johndoe',
        comment: 'comment-123',
        is_deleted: false
      }
    ]

    const expectedThread = {
      id: 'thread-123',
      title: 'ini title thread',
      body: 'ini body thread',
      date: '20201010',
      username: 'winter',
      comments: [
        {
          id: 'comment-123',
          username: 'winter',
          date: '20211010',
          content: '**komentar telah dihapus**'
        }
      ]
    }

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()
    const mockLikeRepository = new LikeRepository()

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread))
    mockCommentRepository.getAllCommentsInThread = jest.fn()
      .mockImplementation(() => Promise.resolve(comments))
    mockReplyRepository.getAllReplies = jest.fn()
      .mockImplementation(() => Promise.resolve(replies))
    mockLikeRepository.getAllLikes = jest.fn()
      .mockImplementation(() => Promise.resolve(likes))

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository
    })

    // Action
    const actualGetThread = await getThreadUseCase.execute(useCasePayload)

    // Assert
    expect(actualGetThread).toEqual(expectedThread)
  })

  it('should return replies with content=**balasan telah dihapus** when replies has been deleted', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123'
    }
    const thread = {
      id: 'thread-123',
      title: 'ini title thread',
      body: 'ini body thread',
      date: '20201010',
      username: 'winter'
    }

    const comments = [
      {
        id: 'comment-123',
        username: 'winter',
        date: '20211010',
        content: 'ini konten',
        is_deleted: false
      }
    ]

    const likes = []

    const replies = [
      {
        id: 'reply-123',
        content: 'ini balasan komentar',
        date: '20211110',
        username: 'johndoe',
        comment: 'comment-123',
        is_deleted: true
      }
    ]

    const expectedThread = {
      id: 'thread-123',
      title: 'ini title thread',
      body: 'ini body thread',
      date: '20201010',
      username: 'winter',
      comments: [
        {
          id: 'comment-123',
          username: 'winter',
          date: '20211010',
          replies: [
            {
              id: 'reply-123',
              content: '**balasan telah dihapus**',
              date: '20211110',
              username: 'johndoe'
            }
          ],
          content: 'ini konten',
          likeCount: 0
        }
      ]
    }

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockReplyRepository = new ReplyRepository()
    const mockLikeRepository = new LikeRepository()

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread))
    mockCommentRepository.getAllCommentsInThread = jest.fn()
      .mockImplementation(() => Promise.resolve(comments))
    mockReplyRepository.getAllReplies = jest.fn()
      .mockImplementation(() => Promise.resolve(replies))
    mockLikeRepository.getAllLikes = jest.fn()
      .mockImplementation(() => Promise.resolve(likes))

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository
    })

    // Action
    const actualGetThread = await getThreadUseCase.execute(useCasePayload)

    // Assert
    expect(actualGetThread).toEqual(expectedThread)
  })
})
