const AddCommentReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');


class RepliesHandler{
    constructor(container){
        this._container = container;
    }

    async postReplyHandler({ payload, params, auth }, h){
        const addReplyUseCase = this._container.getInstance(AddCommentReplyUseCase.name);
        const { content } = payload;
        const { id: credentialId } = auth.credentials;
        const { threadId, commentId } = params;
        const payloadSend = {content, owner: credentialId, thread: threadId, comment: commentId }

        const addedReply = await addReplyUseCase.execute(payloadSend);
        const response = h.response({
            status: 'success',
            data: {
                addedReply,
            },
        });
        response.code(201);
        return response;
    }

    async deleteReplyHandler({ params, auth }, h){
        const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
        const { threadId, commentId, replyId } = params;
        const { id: credentialId } = auth.credentials;
        const payloadSend = { id: replyId, comment: commentId, thread: threadId, owner: credentialId };

        await deleteReplyUseCase.execute(payloadSend);
        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
}

module.exports = RepliesHandler;