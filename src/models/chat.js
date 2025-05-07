class Chat{
    constructor(id, subject, createDate, owner, initialMessage, messages){
        this.id = id;
        this.subject = subject;
        this.createDate = createDate;
        this.owner = owner;
        this.initialMessage = initialMessage;
        this.messages = messages;
    }
    static chatTOJSON(chat){return JSON.stringify(chat) }
    static chatFromJSONToObject(chat) {return JSON.parse(chat)}
}

export {Chat}