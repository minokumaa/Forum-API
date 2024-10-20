class DeleteReplyUseCase{
    constructor({ threadRepository, commentRepository, replyRepository }){
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload) {
        await this._threadRepository.verifyAvailableThread(useCasePayload.thread);
        await this._commentRepository.verifyAvailableComment(useCasePayload.comment);
        await this._replyRepository.verifyAvailableReply(useCasePayload.id);
        await this._replyRepository.verifyReplyOwner(useCasePayload.id, useCasePayload.owner);
        await this._replyRepository.deleteReply(useCasePayload.id);
    }
}

module.exports = DeleteReplyUseCase;