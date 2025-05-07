class Message{
    constructor(id, sender, text, createDate, chatId) {
        this.id = id;
        this.sender = sender;
        this.text = text;
        this.createDate = createDate;
        this.chatId = chatId;
    }

    messageToJSON() { return JSON.stringify(this)}
}

export {Message}