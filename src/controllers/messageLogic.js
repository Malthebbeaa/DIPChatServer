import fs from 'fs/promises';


export {handleNewMessage, deleteMessage, handleEditMessage}

async function handleNewMessage(message, chatId, filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const chats = JSON.parse(data);
        const chat = chats.find(chat => chat.id === chatId);

        const messageObject = typeof message.messageToJSON === 'function'
            ? JSON.parse(message.messageToJSON())
            : message;
        
        chat.messages.push(messageObject);

        await fs.writeFile(filePath, JSON.stringify(chats, null, 2))
    } catch (error) {
        console.error(error);
        throw new Error("Kunne ikke tilføje beskedn. Prøv igen senere.")
    }
}

async function deleteMessage(messageIndex, chatId, filePath){
    try{
        const data = await fs.readFile(filePath, 'utf8');
        const chats = JSON.parse(data);
        const chat = chats.find(chat => chat.id === chatId);

        if(!chat) {
            throw new Error(`Chat med ID ${chatId} findes ikke!`);
        }


        chat.messages.splice(messageIndex, 1);

        await fs.writeFile(filePath, JSON.stringify(chats, null, 2))
    } catch (error) {
        console.error(error);
        throw new Error("Kunne ikke slette beskeden. Prøv igen senere");
    }
}

async function handleEditMessage(newText, chatId, messageId,filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const chats = JSON.parse(data);
        const chat = chats.find(chat => chat.id === chatId);

        if(!chat) {
            throw new Error(`Chat med ID ${chatId} findes ikke.`);
        }

        const messageToEdit = chat.messages.find(message => message.id === messageId);

        if (!messageToEdit) {
            throw new Error(`Besked med ID ${messageId} findes ikke.`);
        }
        messageToEdit.text = newText;

        await fs.writeFile(filePath, JSON.stringify(chats, null, 2));

    } catch (error) {
        console.error(error);
        throw new Error("Kunne ikke redigere beskeden. Prøv igen senere.")
    }
}
