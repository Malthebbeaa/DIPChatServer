import fs from 'fs/promises';
import express, { urlencoded } from 'express';
import session from 'express-session';
import { routes } from './routes.js';


const app = express();

const chats = [{
    id: '1',
    subject: 'Hej',
    createDate: Date.now(),
    owner: 'Anders',
    messages: [] 
}]

let usersIds = 2;

const usersPath = "./FILES/users.json";
let usersJson = await fs.readFile(usersPath, 'utf-8')
const users = JSON.parse(usersJson); //Parse fra JSON til JS

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
app.use('/chat', requireLogin);

function requireLogin(req, res, next) {
    if(!req.session.isLoggedIn) {
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
    const { username, password, userlevel } = request.body;
    request.session.isLoggedIn = true;

    const user = {
        username: username, 
        password: password,
        salt: "ccc",
        dateCreated: Date(),
        id: ++usersIds,
        userlevel: userlevel
    };

    users.push(user);

    response.send({
        ok: true,
        redirect: '/'
    });

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