const GetThread = require('../GetThread');

describe('GetThread entity', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'Lorem ipsum dolor sit amet',
            body: 'Lorem ipsum dolor sit amet',
            date: '2021',
        };

        // Action & Assert
        expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload has invalid data type', () => {
        // Arrange
        const payload = {
            id: 123,
            title: 456,
            body: true,
            date: {},
            username: 454,
        };

        // Action & Assert
        expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create GetThread object correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'Lorem ipsum dolor sit amet',
            body: 'Lorem ipsum dolot sit amet',
            date: '2021',
            username: 'John Doe',
        };

        // Action
        const getThread = new GetThread(payload);

        // Assert
        expect(getThread.id).toEqual(payload.id);
        expect(getThread.title).toEqual(payload.title);
        expect(getThread.body).toEqual(payload.body);
        expect(getThread.date).toEqual(payload.date);
        expect(getThread.username).toEqual(payload.username);
    });
});