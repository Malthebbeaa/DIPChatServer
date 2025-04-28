import fs from 'fs/promises';
import express, { urlencoded } from 'express';
import session from 'express-session';
import { routes } from './assets/js/routes.js';
import { addUserToFile } from './assets/js/registerLogic.js'
import crypto from 'crypto'
import {v4 as uuidv4} from 'uuid'


const app = express();

const usersPath = "./FILES/users.json";
let usersJson = await fs.readFile(usersPath, 'utf-8')
const users = JSON.parse(usersJson); //Parse fra JSON til JS
const chats = JSON.parse(await fs.readFile('./FILES/chats.json', 'utf-8')); //Parse fra JSON til JS

export {chats, users};
//middleware
app.set('view engine', 'pug');
app.use(express.static('assets'));
app.use(session({
    secret: 'DC732C06-B5BA-4B1A-AB1F-88C827772B01',
    saveUninitialized: true,
    resave: true
}));

app.use(express.json());
//app.use('/', routes)
app.use(urlencoded({extended: true}));
app.use(requireLogin);

app.use((request, response, next) => {
    response.locals.knownUser = request.session.isLoggedIn || false;
    response.locals.user = request.session.user || null;
    next();
});

function requireLogin(require, response, next) {
    const publicPaths = ['/', '/login']
    if(!require.session.isLoggedIn && !publicPaths.includes(require.path)) {
        response.redirect('/login');
    } else {
        next();
    }
}


//routes
app.get('/', (request, response) => {
    response.render("frontpage",{chats: chats, users: users});
})

app.get('/login', (request, response) => {
    response.render('login', {});
})

app.get('/logout', (request, response) => {
    request.session.destroy();
    response.redirect('/');
})

app.get('/register', (request, response) => {
    response.render('register');
})

app.post('/register', (request, response) => {
    const { username, password, userlevel } = request.body;
    request.session.isLoggedIn = true;
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


    addUserToFile(user, usersPath);

    response.send({
        ok: true,
        redirect: '/',
        user: user
    });
})


app.post('/login', (request, response) => {
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


app.get('/chats/:id', (request, response) => {
    const chat = chats.find(chat => chat.id === request.params.id);
    response.render('chats', {chat: chat, messages: chat.messages});
})


app.get('/chats/messages/:id', (request, response) => {
    const id = request.params.id;

    chats.forEach(chat => {
        const message = chat.messages.find(message => message.id == id);
        if(message) {
            response.render('uniqueMessage', {chat: chat, message: message})
        }
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


app.listen(8080, () => {
    console.log("Lytter på 8080...");
})

app.get('/users', (request, response) =>{
    response.render('users', {users: users})
})

app.get('/users/:id', (request, response)=> {
    let userInfo = users.find(u => u.username == request.params.id)
    response.render('userinfo', {userInfo: userInfo})
})

app.get('/users/:id/messages', (request, response)=>{
    let userInfo = users.find(u => u.username == request.params.id)
    let userchats = findUserChats(userInfo) 
    response.render('messages',{userInfo: userInfo, chat: chats, userchats: userchats})
})


function findUserChats(user){
    return chats.flatMap(chat => chat.messages.filter((u)=> u.sender == user.username))
}
