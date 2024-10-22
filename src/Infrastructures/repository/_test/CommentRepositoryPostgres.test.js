const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
    });

    afterEach(async () => {
        await CommentTableTestHelper.cleanTable();
    });
    
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('addComment function', () => {
        it('should persist add comment', async () => {
            // Arrange
            const comment = new AddComment({
                content: 'lorem ipsum',
                owner: 'user-123',
                thread: 'thread-123',
            });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await commentRepositoryPostgres.addComment(comment);

            // Assert
            const comments = await CommentTableTestHelper.findCommentById('comment-123');
            expect(comments).toHaveLength(1);
        });

        it('should return added comment correctly', async () => {
            // Arrange
            const comment = new AddComment({
                content: 'lorem ipsum',
                owner: 'user-123',
                thread: 'thread-123',
            });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedComment = await commentRepositoryPostgres.addComment(comment);

            // Assert
            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-123',
                content: comment.content,
                owner: comment.owner,
            }));
        });
    });

    describe ('verifyAvailableComment function', () => {
        it('should not throw error when comment is available', async () => {
            // Arrange
            await CommentTableTestHelper.addComment({});
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).resolves.not.toThrowError(NotFoundError);
        });

        it('should throw NotFoundError when comment is not available', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).rejects.toThrowError(NotFoundError);
        });
    });
    
    describe ('verifyCommentOwner function', () => {
        it('should not throw error when comment\'s owner is correct', async () => {
            // Arrange
            const owner = 'user-123';

            await CommentTableTestHelper.addComment({});
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', owner)).resolves.not.toThrowError(AuthorizationError);
        });

        it('should throw AuthorizationError when comment\'s owner is not correct', async () => {
            // Arrange
            const owner = 'user-980';

            await CommentTableTestHelper.addComment({});
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', owner)).rejects.toThrowError(AuthorizationError);
        });
    });

    describe('deleteComment function', () => {
        it('should delete comment', async () => {
            // Arrange
            const commentId = 'comment-123';

            await CommentTableTestHelper.addComment({});
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action
            await commentRepositoryPostgres.deleteComment(commentId);
            const comment = await CommentTableTestHelper.findCommentById(commentId);

            expect(comment).toHaveLength(0);
        });
    });

    describe('getAllCommentsInThread function', () => {
        it('should return all comment correctly', async () => {
            // Arrange
            const threadId = 'thread-123';
            const expectedResult = {
                id: 'comment-123',
                username: 'dicoding',
                content: 'lorem ipsum',
            };

            await CommentTableTestHelper.addComment({});
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action
            const result = await commentRepositoryPostgres.getAllCommentsInThread(threadId);

            // Assert
            expect(result[0].id).toEqual(expectedResult.id);
            expect(result[0].username).toEqual(expectedResult.username);
            expect(result[0].content).toEqual(expectedResult.content);
            expect(result[0]).toHaveProperty('date');
        });
    });
});