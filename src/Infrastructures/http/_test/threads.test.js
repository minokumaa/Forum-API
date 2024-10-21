const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

describe('/threads endpoint', () => {
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
    
    describe('when POST /threads', () => {
        it('should response 201 and persisted thread', async () => {
            // Arrange
            const payload = {
                title: 'lorem ipsum',
                body: 'lorem ipsum',
            }

            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            await UsersTableTestHelper.findUsersById('user-123');

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
            expect(responseJson.data.addedThread.title).toEqual(payload.title);
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                body: 'lorem ipsum',
            };

            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);
            
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang ditbutuhkan tidak ada');
        });

        it('should response 400 when requset payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                title: 123,
                body: true,
                owner: 'user-123',
            }
            const accessToken = await ServerTestHelper.getAccessToken();
            const server = await createServer(container);
            
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
        });

        it('should response 401 when request doesn\'t have authentiucations', async () => {
            // Arrange
            const requestPayload = {
                title: 'lorem ipsum dolor sit amet',
                body: 'lorem ipsum dolor sit amet',
            };
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
            expect(responseJson.message).toEqual('Missing authentication');
        });
    });

    describe('when GET /threads/{threadId}', () => {
        it('should response 200 and get a thread detail with comments', async () => {
            // Arrange
            const threadId = 'thread-123';
            await ThreadsTableTestHelper.addThread({ id: threadId });
            await CommentTableTestHelper.addComment({});
            const server = await createServer(container);
            
            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread).toBeDefined();
            expect(responseJson.data.thread.comments).toBeDefined();
        });

        it('should response 400 when thread doesn\'t exist', async () => {
            // Arrange
            const threadId = 'thread-123';
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`,
            });

            // Asssert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
        });
    });
});