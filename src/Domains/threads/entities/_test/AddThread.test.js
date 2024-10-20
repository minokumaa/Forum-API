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
            user_id: {},
        };

        // Action & Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddThread object correctly', () => {
        // Arrange
        const payload = {
            title: 'Lorem ipsum dolor sit amet',
            body: 'Lorem ipsum dolor sit amet',
            user_id: 'user-1234',
        };

        // Action
        const addThread = new AddThread(payload);

        // Assert
        expect(addThread.title).toEqual(payload.title);
        expect(addThread.body).toEqual(payload.body);
        expect(addThread.user_id).toEqual(payload.user_id);
    });
});