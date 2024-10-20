const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {};

        // Action & Assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload has invalid data type', () => {
        // Arrange
        const payload = {
            id: 123,
            content: true,
            owner: 'user-123',
        };

        // Action & Assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedReply object correctly', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'lorem ipsum',
            owner: 'user-123',
        }

        // Action
        const addedReply = new AddedReply();

        // Assert
        expect(addedReply.id).toEqual(payload.id);
        expect(addedReply.content).toEqual(payload.content);
        expect(addedReply.owner).toEqual(payload.owner);
    });
});