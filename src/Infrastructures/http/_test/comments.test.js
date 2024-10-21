const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

describe('/threads/threadId/comments endpoint', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({});
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await CommentTableTestHelper.cleanTable();
    });
    
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('when POST /threads/threadId/comments', () => {
        it('should response 201 and persisted comment', async () => {
            // Arrange
            const payload = {
                content: 'lorem ipsum',
            };
            const server = await createServer(container);
            const accessToken = await ServerTestHelper.getAccessToken();
            await ThreadsTableTestHelper.addThread({});
            
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            
            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
            expect(responseJson.data.addedComment.content).toEqual(payload.content);
        });
        
        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const payload = {
                content: 'lorem ipsum',
            };
            const server = await createServer(container);
            const accessToken = await ServerTestHelper.getAccessToken();
            
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            
            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena properti yang ditbutuhkan tidak ada');
        });
        
        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const payload = {
                content: '',
            };
            const server = await createServer(container);
            const accessToken = await ServerTestHelper.getAccessToken();
            await ThreadsTableTestHelper.addThread({});
            
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
        });
    });

    describe('when DELETE /threads/threadId/comments/commentId', () => {
        it('should response 200 when success deleting comment', async () => {
            // Arrange
            const threadId = 'thread-123';
            const commentId = 'comment-123';

            await ThreadsTableTestHelper.addThread({});
            await CommentTableTestHelper.addComment({});

            const server = await createServer(container);
            const accessToken = await ServerTestHelper.getAccessToken();
            
            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            
            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });

        it('should response 404 when deleting comment from unavailable thread', async () => {
            // Arrange
            const threadId = 'thread-980';
            const commentId = 'comment-123';

            const server = await createServer(container);
            const accessToken = await ServerTestHelper.getAccessToken();
            
            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            
            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
        });
        
        it('should response 404 when deleting comment from unavailable comment', async () => {
            // Arrange
            const threadId = 'thread-123';
            const commentId = 'comment-980';

            const server = await createServer(container);
            const accessToken = await ServerTestHelper.getAccessToken();
            
            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            
            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
        });
        
    });
})