const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({});
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
    });
    
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('addThread function', () => {
        it('should persist add thread correctly', async () => {
            // Arrange
            const thread = new AddThread({
                title: 'lorem ipsum',
                body: 'lorem ipsum',
                owner: 'user-123'
            });

            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepositoryPostgres.addThread(thread);

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
            expect(threads).toHaveLength(1);
        });

        it('should return added thread correctly', async () => {
            // Arrange
            const thread = new AddThread({
                title: 'lorem ipsum',
                body: 'lorem ipsum',
                owner: 'user-123'
            });

            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(thread);

            // Assert
            expect(addedThread).toStrictEqual(new AddedThread({
                id: 'thread-123',
                title: 'lorem ipsum',
                owner: 'user-123',
            }));
        });
    });

    describe('verifyAvailableThread function', () => {
        it('should not throw error when thread is available', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({});
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError);
        });

        it('should throw NotFoundError when thread is not available', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).rejects.toThrowError(NotFoundError);
        });
    });

    describe('getThreadById function', () => {
        it('should return thread correctly', async () => {
            // Arrange
            const threadId = 'thread-123';
            const expectedResult = {
                id: 'thread-123',
                title: 'lorem ipsum',
                body: 'lorem ipsum',
                username: 'Winter',
            };
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
            await ThreadsTableTestHelper.addThread({});

            // Action
            const result = await threadRepositoryPostgres.getThreadById(threadId);

            // Assert
            expect(result.id).toStrictEqual(expectedResult.id);
            expect(result.title).toStrictEqual(expectedResult.title);
            expect(result.body).toStrictEqual(expectedResult.body);
            expect(result).toHaveProperty('date');
            expect(result.username).toStrictEqual(expectedResult.username);
        });
    });
});