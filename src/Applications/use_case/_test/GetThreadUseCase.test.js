const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
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
                    content: 'ini konten'
                }
            ]
        }

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockReplyRepository = new ReplyRepository()

        /** mocking needed function */
        mockThreadRepository.verifyAvailableThread = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(thread))
        mockCommentRepository.getAllCommentsInThread = jest.fn()
            .mockImplementation(() => Promise.resolve(comments))
        mockReplyRepository.getAllReplies = jest.fn()
            .mockImplementation(() => Promise.resolve(replies))

        /** creating use case instance */
        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository
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
            .toHaveBeenCalledWith(useCasePayload.threadId)
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
                    content: '**komentar telah dihapus**'
                }
            ]
        }

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockReplyRepository = new ReplyRepository()

        /** mocking needed function */
        mockThreadRepository.verifyAvailableThread = jest.fn()
            .mockImplementation(() => Promise.resolve())
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve(thread))
        mockCommentRepository.getAllCommentsInThread = jest.fn()
            .mockImplementation(() => Promise.resolve(comments))
        mockReplyRepository.getAllReplies = jest.fn()
            .mockImplementation(() => Promise.resolve(replies))

        /** creating use case instance */
        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository
        })

        // Action
        const actualGetThread = await getThreadUseCase.execute(useCasePayload)

        // Assert
        expect(actualGetThread).toEqual(expectedThread)
    })
})