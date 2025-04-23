import fs from 'fs/promises';
import express, { urlencoded } from 'express';
import session from 'express-session';
import { routes } from './routes.js';
import { render } from 'pug';

const app = express();

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


//routes
app.get('', (request, response) => {
    response.render("frontpage");
})

app.get('/login', (request, response) => {
    response.render('login', {});
})

app.get('/logout', (request, response) => {
    request.session.destroy();
    response.redirect('');
})

app.post('/login', (request, response) => {
    console.log(request.body);
})

app.listen(8080, () => {
    console.log("Lytter på 8080...");
})