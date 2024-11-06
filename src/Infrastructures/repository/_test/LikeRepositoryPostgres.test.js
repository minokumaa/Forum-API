/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool')
const AddLike = require('../../../Domains/likes/entities/AddLike')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper')
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres')

describe('LikeRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({})
    await ThreadsTableTestHelper.addThread({})
    await CommentsTableTestHelper.addComment({})
  })

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('addLike function', () => {
    it('should persist add like', async () => {
      // Arrange
      const like = new AddLike({
        comment: 'comment-123',
        owner: 'user-123'
      })

      const fakeIdGenerator = () => '123'
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await likeRepositoryPostgres.like(like)

      // Assert
      const likes = await LikesTableTestHelper.findLikebyId('like-123')
      expect(likes).toHaveLength(1)
    })
  })

  describe('verifyLikeStatus function', () => {
    it('should throw true when data is available', async () => {
      // Arrange
      const commentId = 'comment-123'
      const userId = 'user-123'
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {})

      // Action
      await LikesTableTestHelper.addLike({})
      const liked = await likeRepositoryPostgres.verifyLikeStatus(commentId, userId)

      // Assert
      expect(liked).toEqual(true)
    })

    it('should throw false when data is not available', async () => {
      // Arrange
      const commentId = 'comment-123'
      const userId = 'user-123'
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {})

      // Action
      const liked = await likeRepositoryPostgres.verifyLikeStatus(commentId, userId)

      // Assert
      expect(liked).toEqual(false)
    })
  })

  describe('unlike function', () => {
    it('should delete like', async () => {
      // Arrange
      const id = 'like-123'
      const ownerId = 'user-123'
      const commentId = 'comment-123'

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {})
      await LikesTableTestHelper.addLike({})

      // Action
      await likeRepositoryPostgres.unlike(commentId, ownerId)
      const like = await LikesTableTestHelper.findLikebyId(id)

      // Assert
      expect(like).toHaveLength(0)
    })
  })

  describe('getAllLike function', () => {
    it('should return all like correctly', async () => {
      // Arrange
      const commentId = 'comment-123'
      const expectedResult = [{
        id: 'like-123',
        owner: 'user-123',
        comment: 'comment-123'
      }]

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {})
      await LikesTableTestHelper.addLike({})

      // Action
      const like = await likeRepositoryPostgres.getAllLikes(commentId)

      // Assert
      expect(like[0].id).toEqual(expectedResult[0].id)
      expect(like[0].owner).toEqual(expectedResult[0].owner)
      expect(like[0].comment).toEqual(expectedResult[0].comment)
      expect(like[0]).toHaveProperty('date')
    })
  })
})
