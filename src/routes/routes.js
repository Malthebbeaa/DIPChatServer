import {Router} from 'express';
import { updateChats } from '../../app.js';
import {chats, users} from '../../app.js'
import { addUserToFile } from '../../src/controllers/registerLogic.js'
import { handleNewSubject, deleteSubject} from './../controllers/subjectLogic.js'
import {v4 as uuidv4} from 'uuid'
import { User } from '../models/user.js'
import {Chat} from '../models/chat.js'
import crypto from 'crypto'
const usersPath = "./FILES/users.json";


const routes = Router();

routes.get('/', (request, response) => {
    response.render("frontpage",{chats: chats, users: users});
})

routes.get('/login', (request, response) => {
    if(request.session.isLoggedIn) {
        response.redirect('/');
        return;
    }
    response.render('login', {});
})

routes.get('/logout', (request, response) => {
    request.session.destroy();
    response.redirect('/');
})

routes.get('/register', (request, response) => {
    response.render('register');
})

routes.post('/register', (request, response) => {
    const { username, password, userlevel } = request.body;
    const now = new Date();
    const salt = uuidv4();
    
    const user = new User(
        username,
        hashPassword(password, salt),
        salt,
        now.toISOString(), //dateCreated
        uuidv4(), //id
        userlevel 
    )
    
    request.session.isLoggedIn = true;
    request.session.user = user;

    addUserToFile(user, usersPath);

    response.send({
        ok: true,
        redirect: '/',
        user: user
    });
})


routes.post('/login', (request, response) => {
    const { username, password } = request.body;
    const user = users.find(u => u.username === username);

    if(checkuserCredentials(username, password)) {
        request.session.isLoggedIn = true;
        request.session.user = user;
        response.json({
            status: 'ok',
            ok: true,
            redirect: '/'
        })
    } else {
        response.json({
            ok: false,
            message: "wrong username or password"
        })
    }

})

routes.get('/createchat', (request, response) => {
    response.render('createChat')
})

routes.post('/createchat', async (request, response) => {
    const chat = new Chat (
        uuidv4(),
        request.body.subject,
        new Date().toISOString(),
        request.body.user,
        request.body.description,
        []
    )
    await handleNewSubject(chat, './FILES/chats.json')
    await updateChats();
    response.status(200).send({ 
        ok: true,
        message: "chat er oprettet",
    })
})

routes.delete('/deletechat/:id', async (request, response) => {
    const id = request.params.id;

    const chatIndex = chats.findIndex(chat => chat.id == id);
    if (chatIndex !== -1) {
        await deleteSubject(chatIndex, './FILES/chats.json');
    }
    await updateChats();
    response.json({
        status: 'ok',
        ok: true,
    })
})

function checkuserCredentials(username, password) {
    let credentials = false;
    const hashedPassword = hashPassword(password, users.find(u => u.username === username).salt);
    let user = users.find(u => u.username === username && u.password === hashedPassword);

    if(user) {
        credentials = true;
    }
    return credentials;
}

// Funktion til at hashe password
function hashPassword(password, salt) {
    const hash = crypto.createHmac('sha256', salt);
    hash.update(password);
    return hash.digest('hex');
}



export {routes};