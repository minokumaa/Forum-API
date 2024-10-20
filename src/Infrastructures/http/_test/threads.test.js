const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });
    
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        it('should response 201 and persisted thread', async () => {
            // Arrange
            const server = await createServer(container);
            /* User */
            const requestPayloadUser = {
                username: 'username',
                password: 'password',
                fullname: 'A fullname',
            };
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayloadUser,
            });
            /* Login user */
            const responseAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: requestPayloadUser.username,
                    password: requestPayloadUser.password,
                },
            });
            const responseJsonAuth = JSON.parse(responseAuth.payload);
            const { accessToken } = responseJsonAuth.data;
            /* Thread */
            const requestPayloadThread = {
                title: 'lorem ipsum dolot sit amet',
                body: 'lorem ipsum dolor sit amet',
            };

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayloadThread,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const server = await createServer(container);
            /* User */
            const requestPayloadUser = {
                username: 'username',
                password: 'password',
                fullname: 'A fullname',
            };
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayloadUser,
            });
            /* Login user */
            const responseAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: requestPayloadUser.username,
                    password: requestPayloadUser.password,
                },
            });
            const responseJsonAuth = JSON.parse(responseAuth.payload);
            const { accessToken } = responseJsonAuth.data;
            /* Thread */
            const requestPayloadThread = {
                title: 'lorem ipsum dolot sit amet',
            };

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayloadThread,
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
            const server = await createServer(container);
            /* User */
            const requestPayloadUser = {
                username: 'username',
                password: 'password',
                fullname: 'A fullname',
            };
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayloadUser,
            });
            /* Login user */
            const responseAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: requestPayloadUser.username,
                    password: requestPayloadUser.password,
                },
            });
            const responseJsonAuth = JSON.parse(responseAuth.payload);
            const { accessToken } = responseJsonAuth.data;
            /* Thread */
            const requestPayloadThread = {
                title: 'lorem ipsum dolot sit amet',
                body: ['lorem ipsum dolor sit amet'],
            };

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayloadThread,
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
            const server = await createServer(container);
            /* User */
            const requestPayloadUser = {
                username: 'username',
                password: 'password',
                fullname: 'A fullname',
            };
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: requestPayloadUser,
            });
            /* Login user */
            const responseAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: requestPayloadUser.username,
                    password: requestPayloadUser.password,
                },
            });
            const responseJsonAuth = JSON.parse(responseAuth.payload);
            const { accessToken } = responseJsonAuth.data;
            /* Thread */
            const requestPayloadThread = {
                title: 'lorem ipsum dolot sit amet',
                body: 'lorem ipsum dolor sit amet',
            };
            const responseThreads = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayloadThread,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const responseJsonThreads = JSON.parse(responseThreads.payload);
            const { addedThread } = responseJsonThreads.data;

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${addedThread.id}`
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
        });

        it('should response 400 when thread doesn\'t exist', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-123',
            });

            // Asssert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Thread tidak ditemukan');
        });
    });
});