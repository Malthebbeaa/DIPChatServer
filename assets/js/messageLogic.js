import fs from 'fs/promises';
import {v4 as uuidv4} from 'uuid'


export {handleNewMessage}

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
const message = {
    id: uuidv4(),
    sender: "sender",
    text: "tekst",
    createDate: new Date().toISOString(),
    chatId: "4ddd3b6e-6fd2-4d05-9ef1-3cd777cde8a7"
};
handleNewMessage(message, "4ddd3b6e-6fd2-4d05-9ef1-3cd777cde8a7", '../../FILES/chats.json');