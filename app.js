import fs from 'fs/promises';
import express, { urlencoded } from 'express';
import session from 'express-session';
import { routes } from './routes.js';
import crypto from crypto


const app = express();

let usersIds = 2;

const usersPath = "./FILES/users.json";
let usersJson = await fs.readFile(usersPath, 'utf-8')
const users = JSON.parse(usersJson); //Parse fra JSON til JS
const chats = JSON.parse(await fs.readFile('./FILES/chats.json', 'utf-8')); //Parse fra JSON til JS

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
        res.redirect('/login');
    } else {
        next();
    }
}


//routes
app.get('/', (request, response) => {
    response.render("frontpage",{knownUser: request.session.isLoggedIn, chats: chats, users: users});
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
    const user = {
        username: username, 
        password: password,
        salt: "ccc",
        dateCreated: now.toISOString(),
        id: ++usersIds,
        userlevel: userlevel
    };


    addUserToFile(user, usersPath);

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
    const hashedPassword = hashPassword(password, users.find(u => u.username === username).salt);
    let user = users.find(u => u.username === username && u.password === hashedPassword);

    if(user) {
        credentials = true;
    }
    return credentials;
}

async function addUserToFile(user, filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const users = JSON.parse(data);

        users.push(user);

        await fs.writeFile(filePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.log(error);
    }
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