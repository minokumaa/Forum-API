class CommentsHandler{
    constructor({ addCommentUseCase, deleteCommentUseCase }){
        this._addCommentUseCase = addCommentUseCase;
        this._deleteCommentUseCase = deleteCommentUseCase;
    }

    async postCommentHandler(request, h){
        const addedComment = await this._addCommentUseCase.execute(request.payload, request.params, request.headers);
        const response = h.response({
            status: 'success',
            data: {
                addedComment: {
                    id: addedComment.id,
                    content: addedComment.content,
                    owner: addedComment.owner,
                },
            },
        });
        response.code(201);
        return response;
    }

    async deleteCommentHandler(request, h){
        await this._deleteCommentUseCase.execute(request.params, request.headers);
        const response = h.response({
            status: 'success',
        });
        return response
    }
}

module.exports = CommentsHandler;