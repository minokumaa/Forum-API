const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler{
    constructor(container){
        this._container = container
    }

    async postCommentHandler({ payload, params, auth }, h){
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
        const { content } = payload;
        const { id: credentialId } = auth.credentials;
        const { threadId } = params;
        const payloadSend = { content, owner: credentialId, thread: threadId };

        const addedComment = await addCommentUseCase.execute(payloadSend);
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

    async deleteCommentHandler({ params, auth }, h){
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
        const { threadId, commentId } = params;
        const { id: credentialId } = auth.credentials;
        const payloadSend = { commentId: commentId, thread: threadId, owner: credentialId };

        await deleteCommentUseCase.execute(payloadSend);
        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response
    }
}

module.exports = CommentsHandler;