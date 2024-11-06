/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const AddReply = require('../../../Domains/replies/entities/AddReply')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ReplyTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres')

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({})
    await ThreadsTableTestHelper.addThread({})
    await CommentTableTestHelper.addComment({})
  })

  afterEach(async () => {
    await ReplyTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('addReply function', () => {
    it('should persist add reply', async () => {
      // Arrange
      const addReply = new AddReply({
        content: 'lorem ipsum',
        owner: 'user-123',
        comment: 'comment-123'
      })

      const fakeIdGenerator = () => '123'
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await replyRepositoryPostgres.addReply(addReply)

      // Assert
      const reply = await ReplyTableTestHelper.findReplyById('reply-123')
      expect(reply).toHaveLength(1)
    })

    it('should return added reply correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        content: 'lorem ipsum',
        owner: 'user-123',
        comment: 'comment-123'
      })

      const fakeIdGenerator = () => '123'
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply)

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: addReply.content,
        owner: addReply.owner
      }))
    })
  })

  describe('verifyAvailableReply function', () => {
    it('should not throw error when reply is available', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})
      await ReplyTableTestHelper.addReply({})

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailableReply('reply-123')).resolves.not.toThrowError(NotFoundError)
    })

    it('should throw NotFoundError when reply is no tavailable', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyAvailableReply('reply-123')).rejects.toThrowError(NotFoundError)
    })
  })

  describe('verifyReplyOwner function', () => {
    it('should not throw error when reply is available', async () => {
      // Arrange
      const owner = 'user-123'
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})
      await ReplyTableTestHelper.addReply({})

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', owner)).resolves.not.toThrowError(AuthorizationError)
    })

    it('should throw NotFoundError when reply is no tavailable', async () => {
      // Arrange
      const owner = 'user-980'
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})
      await ReplyTableTestHelper.addReply({})

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', owner)).rejects.toThrowError(AuthorizationError)
    })
  })

  describe('deleteReply function', () => {
    it('should delete reply', async () => {
      // Arrange
      const replyId = 'reply-123'
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})
      await ReplyTableTestHelper.addReply({})

      // Action
      await replyRepositoryPostgres.deleteReply(replyId)
      const reply = await ReplyTableTestHelper.findReplyById(replyId)

      expect(reply).toHaveLength(0)
    })
  })

  describe('getAllReplies function', () => {
    it('should return all replies correctly', async () => {
      // Arrange
      const commentId = 'comment-123'
      const expectedResult = {
        id: 'reply-123',
        content: 'lorem ipsum',
        date: '20211110',
        username: 'dicoding',
        comment: 'comment-123',
        is_deleted: false
      }
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {})
      await ReplyTableTestHelper.addReply({})

      // Action
      const result = await replyRepositoryPostgres.getAllReplies(commentId)

      // Assert
      expect(result[0].id).toEqual(expectedResult.id)
      expect(result[0].content).toEqual(expectedResult.content)
      expect(result[0]).toHaveProperty('date')
      expect(result[0].username).toEqual(expectedResult.username)
      expect(result[0].comment).toEqual(expectedResult.comment)
      expect(result[0].is_deleted).toEqual(expectedResult.is_deleted)
    })
  })
})
