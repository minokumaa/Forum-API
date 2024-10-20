const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
    constructor(container){
        this._container = container;
    }

    async postThreadHandler({payload, auth}, h){
        const addThreadUseCase = this._container.getInstace(AddThreadUseCase.name);
        const { title, body } = payload;
        const { id: credentialId } = auth.credentials;
        const payloadSend = { title, body, owner: credentialId};

        const addedThread = await addThreadUseCase.execute(payloadSend);
        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async getThreadHandler({ params }, h){
        const getThreadUseCase = this._container.getInstace(GetThreadUseCase.name);
        const { threadId } = params;
        const detailThread = await getThreadUseCase.execute({ threadId });
        const response = h.response({
            status: 'success',
            data: {
                thread: detailThread,
            },
        });
        return response;
    }
}

module.exports = ThreadsHandler;