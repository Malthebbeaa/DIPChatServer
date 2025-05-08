import fs from 'fs/promises';
import express, { urlencoded } from 'express';
import session from 'express-session';
import { routes } from './src/routes/routes.js';
import {userRouter} from './src/routes/userroutes.js'
import {chatRouter} from './src/routes/chatroutes.js'


const app = express();

const usersPath = "./FILES/users.json";
let usersJson = await fs.readFile(usersPath, 'utf-8')
const users = JSON.parse(usersJson); //Parse fra JSON til JS
let chats = JSON.parse(await fs.readFile('./FILES/chats.json', 'utf-8')); //Parse fra JSON til JS


//middleware
app.use(express.json());
app.use(express.static('assets'));
app.set('view engine', 'pug');
app.use(session({
    secret: 'DC732C06-B5BA-4B1A-AB1F-88C827772B01',
    saveUninitialized: true,
    resave: true
}));

app.use(urlencoded({extended: true}));
app.use(requireLogin);

app.use((request, response, next) => {
    response.locals.knownUser = request.session.isLoggedIn || false;
    response.locals.user = request.session.user || null;
    next();
});
app.use('/', routes)
routes.use('/users', userRouter);
routes.use('/chats', chatRouter);



function requireLogin(require, response, next) {
    const publicPaths = ['/', '/login', '/register']
    if(!require.session.isLoggedIn && !publicPaths.includes(require.path)) {
        response.redirect('/login');
    } else {
        next();
    }
}

async function updateChats() {
    try {
        const data = await fs.readFile('./FILES/chats.json', 'utf-8');
        chats = JSON.parse(data);
    } catch (error) {
        console.error("Fejl under opdatering af chats:", error);
    }
}


app.listen(8080, () => {
    console.log("Lytter på 8080...");
})

export {updateChats}
export {chats, users};