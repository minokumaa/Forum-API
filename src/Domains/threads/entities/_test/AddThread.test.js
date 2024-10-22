const AddThread = require('../AddThread');

describe('AddThread entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'Lorem ipsum dolor sit amet',
        };

        // Action & Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload has invalid data type', () => {
        // Arrange
        const payload = {
            title: 1984,
            body: true,
            owner: {},
        };

        // Action & Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddThread object correctly', () => {
        // Arrange
        const payload = {
            title: 'Lorem ipsum dolor sit amet',
            body: 'Lorem ipsum dolor sit amet',
            owner: 'user-123',
        };

        // Action
        const addThread = new AddThread(payload);

        // Assert
        expect(addThread.title).toEqual(payload.title);
        expect(addThread.body).toEqual(payload.body);
        expect(addThread.owner).toEqual(payload.owner);
    });
});