/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool')
const container = require('../../container')
const createServer = require('../createServer')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ServerTestHelper = require('../../../../tests/ServerTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')

describe('/threads/threadId/comments endpoint', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({})
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await CommentTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable()
    await pool.end()
  })

  describe('when POST /threads/threadId/comments/replies', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const payload = {
        content: 'lorem ipsum'
      }

      await ThreadsTableTestHelper.addThread({})
      await CommentTableTestHelper.addComment({})

      const accessToken = await ServerTestHelper.getAccessToken()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()
      expect(responseJson.data.addedReply.content).toEqual(payload.content)
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const payload = {
        content: ''
      }

      await ThreadsTableTestHelper.addThread({})
      await CommentTableTestHelper.addComment({})

      const accessToken = await ServerTestHelper.getAccessToken()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat balasan pada komentar karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 when requset payload not meet data type specification', async () => {
      // Arrange
      const payload = {
        content: 123
      }

      await ThreadsTableTestHelper.addThread({})
      await CommentTableTestHelper.addComment({})

      const accessToken = await ServerTestHelper.getAccessToken()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('tidak dapat membuat balasan pada komentar karena tipe data tidak sesuai')
    })

    it('should response 404 when adding a reply to a comment in an unavailable thread', async () => {
      // Arrange
      const payload = {
        content: 'lorem ipsum'
      }

      const accessToken = await ServerTestHelper.getAccessToken()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 404 when adding a reply to an unavailable comment', async () => {
      // Arrange
      const payload = {
        content: 'lorem ipsum'
      }

      await ThreadsTableTestHelper.addThread({})

      const accessToken = await ServerTestHelper.getAccessToken()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })
  })

  describe('when DELETE /threads/threadId/comments/replies', () => {
    it('should response 200 and success when delete reply', async () => {
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const replyId = 'reply-123'

      await ThreadsTableTestHelper.addThread({})
      await CommentTableTestHelper.addComment({})
      await RepliesTableTestHelper.addReply({})

      const accessToken = await ServerTestHelper.getAccessToken()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })

    it('should response 404 when deleting reply from unavailable thread', async () => {
      const threadId = 'thread-980'
      const commentId = 'comment-123'
      const replyId = 'reply-123'

      await ThreadsTableTestHelper.addThread({})
      await CommentTableTestHelper.addComment({})
      await RepliesTableTestHelper.addReply({})

      const accessToken = await ServerTestHelper.getAccessToken()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 404 when deleting reply from unavailable comment', async () => {
      const threadId = 'thread-123'
      const commentId = 'comment-980'
      const replyId = 'reply-123'

      await ThreadsTableTestHelper.addThread({})
      await CommentTableTestHelper.addComment({})
      await RepliesTableTestHelper.addReply({})

      const accessToken = await ServerTestHelper.getAccessToken()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })

    it('should response 404 when deleting reply from unavailable reply', async () => {
      const threadId = 'thread-123'
      const commentId = 'comment-123'
      const replyId = 'reply-123'

      await ThreadsTableTestHelper.addThread({})
      await CommentTableTestHelper.addComment({})

      const accessToken = await ServerTestHelper.getAccessToken()
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
    })
  })
})
