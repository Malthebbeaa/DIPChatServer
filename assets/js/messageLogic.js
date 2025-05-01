import fs from 'fs/promises';
import {v4 as uuidv4} from 'uuid'


export {handleNewMessage, deleteMessage, handleEditMessage}

async function handleNewMessage(message, chatId, filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const chats = JSON.parse(data);
        const chat = chats.find(chat => chat.id === chatId);

        chat.messages.push(message);

        await fs.writeFile(filePath, JSON.stringify(chats, null, 2))
    } catch (error) {
        console.error(error)
    }
}

async function deleteMessage(messageIndex, chatId, filePath){
    try{
        const data = await fs.readFile(filePath, 'utf8');
        const chats = JSON.parse(data);
        const chat = chats.find(chat => chat.id === chatId);

        chat.messages.splice(messageIndex, 1);

        await fs.writeFile(filePath, JSON.stringify(chats, null, 2))
    } catch (error) {
        console.error(error)
    }
}

async function handleEditMessage(newText, chatId, messageId,filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const chats = JSON.parse(data);
        const chat = chats.find(chat => chat.id === chatId);
        const messageToEdit = chat.messages.find(message => message.id === messageId);

        messageToEdit.text = newText;

        await fs.writeFile(filePath, JSON.stringify(chats, null, 2));

    } catch (error) {
        console.error(error);
    }
}