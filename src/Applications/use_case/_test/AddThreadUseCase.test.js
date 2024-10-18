const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add user action correctly', async () => {
        // Arrange
        const user = {
            id: 'user-123',
            username: 'username',
        };

        const useCasePayload = {
            title: 'lorem ipsum dolor sit amet',
            body: 'lorem ipsum dolor sit amet',
            user_id: user.id,
        };

        const headerAuthorization = 'Bearer accessToken';

        const expectedAddedThread = new AddedThread({
            id: 'thread-123',
            title: 'lorem ipsum dolor sit amet',
            owner: user.username,
        });

        const accessToken = 'accessToken';

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(
                expectedAddedThread,
            ));

        /** creating use case instance */
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedThread = await addThreadUseCase.execute(useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual(new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: user.username,
        }));
        expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread(useCasePayload));
    });
});