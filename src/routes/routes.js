import {Router} from 'express';
import { updateChats } from '../../app.js';
import {chats, users} from '../../app.js'
import { addUserToFile } from '../../src/controllers/registerLogic.js'
import { handleNewSubject, deleteSubject} from './../controllers/messageLogic.js'
import {v4 as uuidv4} from 'uuid'
import crypto from 'crypto'

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
    const user = {
        username: username, 
        password: hashPassword(password, salt),
        salt: salt,
        dateCreated: now.toISOString(),
        id: uuidv4(),
        userlevel: userlevel
    };
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

routes.get('/createsubject', (request, response) => {
    response.render('createChat')
})

routes.post('/createsubject', (request, response) => {
    const subject ={
        id: uuidv4(),
        subject: request.body.subject,
        createDate: new Date().toISOString(),
        owner: request.body.user,
        initialMessage: request.body.description,
        messages: []
    }
    handleNewSubject(subject, './FILES/chats.json')
    
    response.status(200).send({ 
        ok: true,
        message: "chat er oprettet",
    })
    updateChats();
})

routes.delete('/deletesubject/:id', async (request, response) => {
    const id = request.params.id;

    const chatIndex = chats.findIndex(chat => chat.id == id);
    if (chatIndex !== -1) {
        await deleteSubject(chatIndex, './FILES/chats.json');
    }
    updateChats('./FILES/chats.json');
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