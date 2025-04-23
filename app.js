import fs from 'fs/promises';
import express, { urlencoded } from 'express';
import session from 'express-session';
import { routes } from './routes.js';
import { render } from 'pug';

const app = express();

const users = {
    'Malthe' : '1234',
    'Anders' : '12345'
};

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
    response.render("frontpage");
})

app.get('/login', (request, response) => {
    response.render('login', {});
})

app.get('/logout', (request, response) => {
    request.session.destroy();
    response.render('frontpage');
})

app.get('/register', (request, response) => {
    response.render('register');
})

app.post('/register', (request, response) => {
    
})

app.post('/frontpage', (request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    if(checkuserCredentials(username, password)) {
        request.session.isLoggedIn = true;
        response.render('frontpage', {knownUser: request.session.isLoggedIn});
    } else {
        alert("Wrong username or password");
    }

})

function checkuserCredentials(username, password) {
    let credentials = false;

    if(users[username] && users[username] == password) {
        credentials = true;
    }

    return credentials;
}

app.listen(8080, () => {
    console.log("Lytter på 8080...");
})