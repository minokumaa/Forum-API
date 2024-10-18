class NewThread{
    constructor(payload){
        this._verifyPayload(payload);

        this.title = payload.title;
        this.body = payload.body;
        this.user_id = payload.user_id;
    }

    _verifyPayload({ title, body, user_id: owner }){
        if(!title || !body || !owner){
            throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if(typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string'){
            throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = NewThread;