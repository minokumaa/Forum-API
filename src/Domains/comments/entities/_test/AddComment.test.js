const AddComment = require('../AddComment');

describe('AddComment entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'lorem ipsum'
        };

        // Action & Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload has invalid data type', () => {
        // Arrange
        const payload = {
            content: true,
            owner: 123,
            thread: [],
        };

        // Action & Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddComment object correctly', () => {
        // Arrange
        const payload = {
            content: 'lorem ipsum',
            owner: 'user-123',
            thread: 'thread-123',
        };

        // Action
        const addComment = new AddComment(payload);

        // Assert
        expect(addComment.content).toEqual(payload.content);
        expect(addComment.owner).toEqual(payload.owner);
        expect(addComment.thread).toEqual(payload.thread);
    });
});