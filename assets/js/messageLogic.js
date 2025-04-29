import fs from 'fs/promises';
import {v4 as uuidv4} from 'uuid'


export {handleNewMessage, deleteMessage}

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

async function deleteMessage(message, chatId, filePath){
    try{
        const data = await fs.readFile(filePath, 'utf8');
        const chats = JSON.parse(data);
        const chat = chats.find(chat => chat.id === chatId);

        chat.messages.pop(message);

        await fs.writeFile(filePath, JSON.stringify(chats, null, 2))
    } catch (error) {
        console.error(error)
    }
}
