import fs from 'fs/promises';
import express, { urlencoded } from 'express';
import session from 'express-session';
import { routes } from './routes.js';
import { render } from 'pug';

const app = express();

const chats = [{
    id: '1',
    subject: 'Hej',
    createDate: Date.now(),
    owner: 'Anders',
    messages: [] 
}]


const users = [{
    username: 'Malthe',
    password: '1234',
    salt: 'aaa',
    dateCreated: '2025-04-25',
    id: '1',
    userLevel: '3'
},
{
    username: 'Anders',
    password: '12345',
    salt: 'bbb',
    dateCreated: '2025-04-25',
    id: '2',
    userLevel: '3'
}];

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
app.use(checkUser);

function checkUser(req, res, next) {
    if(req.url === "/chat" && !req.session.isLoggedIn) {
        res.redirect('/');
    } else {
        next();
    }
}


//routes
app.get('', (request, response) => {
    response.render("frontpage",{knownUser: request.session.isLoggedIn, chats: chats});
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
    
})

app.post('/login', (request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    if(checkuserCredentials(username, password)) {
        request.session.isLoggedIn = true;
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

function checkuserCredentials(username, password) {
    let credentials = false;
    let user = users.find(u => u.username === username && u.password === password);

    if(user) {
        credentials = true;
    }

    return credentials;
}

app.listen(8080, () => {
    console.log("Lytter på 8080...");
})