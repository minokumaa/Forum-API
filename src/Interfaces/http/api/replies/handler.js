class RepliesHandler{
    constructor({ addReplyUseCase, deleteReplyUseCase }){
        this._addReplyUseCase = addReplyUseCase;
        this._deleteReplyUseCase = deleteReplyUseCase;
    }

    async postReplyHandler(request, h){
        const addedReply = await this._addReplyUseCase.execute(request.payload, request.params, request.headers);
        const response = h.response({
            status: 'success',
            data: {
                addedReply,
            },
        });
        response.code(201);
        return response;
    }

    async deleteReplyHandler(request, h){
        await this._deleteReplyUseCase.execute(request.params, request.headers);
        const response = h.response({
            status: 'success',
        });
        return response;
    }
}

module.exports = RepliesHandler;