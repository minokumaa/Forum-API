const NewThread = require('../NewThread');

describe('NewThread entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'Lorem ipsum dolor sit amet',
        };

        // Action & Assert
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload has invalid data type', () => {
        // Arrange
        const payload = {
            title: 1984,
            body: true,
            owner: {},
        };

        // Action & Assert
        expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create NewThread object correctly', () => {
        // Arrange
        const payload = {
            title: 'Lorem ipsum dolor sit amet',
            body: 'Lorem ipsum dolor sit amet',
            owner: 'user-1234',
        };

        // Action
        const newThread = new NewThread(payload);

        // Assert
        expect(newThread.title).toEqual(payload.title);
        expect(newThread.body).toEqual(payload.body);
    });
});