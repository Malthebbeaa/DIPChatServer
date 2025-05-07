import {Router} from 'express';
import {chats, users} from '../../app.js'
import { handleNewMessage, deleteMessage , handleEditMessage} from '../../src/controllers/messageLogic.js'
import { updateChats } from '../../app.js';
import {v4 as uuidv4} from 'uuid'


const chatRouter = Router();

chatRouter.get('/:id', async (request, response) => {
    await updateChats();
    const chat = chats.find(chat => chat.id === request.params.id);
    response.render('chats', {chat: chat, messages: chat.messages});
    
})


chatRouter.get('/messages/:id', (request, response) => {
    const id = request.params.id;

    chats.forEach(chat => {
        const message = chat.messages.find(message => message.id == id);
        if(message) {
            response.render('uniqueMessage', {chat: chat, message: message})
        }
    })
})

chatRouter.delete('/messages/:id', async (request, response) => {
    const id = request.params.id;

    for (const chat of chats) {
        const messageIndex = chat.messages.findIndex(message => message.id == id);
        if (messageIndex !== -1) {
            await deleteMessage(messageIndex, chat.id, './FILES/chats.json');
        }
    }
    await updateChats();
    response.json({
        status: 'ok',
        ok: true,
    })
})

chatRouter.post('/message', async (request, response) => {
    const {chatId, sender, tekst} = request.body;
    const now = new Date();
    const message = new Message(
        uuidv4(),
        sender,
        tekst,
        now.toISOString(),
        chatId
    );
    
    await handleNewMessage(message, chatId, './FILES/chats.json')

    response.status(200).send({
        ok:true,
        message: message
    })
})

chatRouter.put('/message/:id', async (request, response) => {
    const {newText, chatId, messageId} = request.body;
    await handleEditMessage(newText, chatId, messageId,'./FILES/chats.json');

    response.status(200).send({
        ok:true,
        messageId: messageId,
        newText: newText
    })
})

export {chatRouter}