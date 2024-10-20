class DeleteCommentUseCase{
    constructor({ threadRepository, commentRepository }){
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        await this._threadRepository.verifyAvailableThread(useCasePayload.thread);
        await this._commentRepository.verifyAvailableComment(useCasePayload.commentId);
        await this._commentRepository.verifyCommentOwner(useCasePayload.commentId, useCasePayload.owner);
        await this._commentRepository.deleteComment(useCasePayload.commentId);
    }
}

module.exports = DeleteCommentUseCase;