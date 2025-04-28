import {Router} from 'express';
import {chats, users} from '../../app.js'
const routes = Router();

routes.get('/', (request, response) => {
    response.render('frontpage', {knownUser: true, chats: chats, users: users})
})


routes.post('/login', (request, response) => {
    console.log(request.body);
})

export {routes};