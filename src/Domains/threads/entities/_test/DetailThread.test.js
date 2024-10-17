const DetailThread = require('../DetailThread');

describe('DetailThread entity', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'thread-1234',
            title: 'Lorem ipsum dolor sit amet',
            body: 'Lorem ipsum dolor sit amet',
            date: '2021',
        };

        // Action & Assert
        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload has invalid data type', () => {
        // Arrange
        const payload = {
            id: 123,
            title: 456,
            body: true,
            date: {},
            username: 454,
            comments: 'comments',
        };

        // Action & Assert
        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create NewThread object correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-1234',
            title: 'Lorem ipsum dolor sit amet',
            body: 'Lorem ipsum dolot sit amet',
            date: '2021',
            username: 'John Die',
            comments: [],
        };

        // Action
        const detailThread = new DetailThread(payload);

        // Assert
        expect(detailThread.id).toEqual(payload.id);
        expect(detailThread.title).toEqual(payload.title);
        expect(detailThread.body).toEqual(payload.body);
        expect(detailThread.date).toEqual(payload.date);
        expect(detailThread.username).toEqual(payload.username);
        expect(detailThread.comments).toEqual(payload.comments);
    });
});