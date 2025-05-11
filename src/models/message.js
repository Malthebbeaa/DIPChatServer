class Message{
    #id
    constructor(id, sender, text, createDate, chatId) {
        this.#id = id;
        this.sender = sender;
        this.text = text;
        this.createDate = createDate;
        this.chatId = chatId;
    }
    getMessageId() {return this.#id};
    static messageToJSON(message) { return JSON.stringify(message);};
    static fromJSONToObject(json) { return JSON.parse(json) };
}

export {Message}