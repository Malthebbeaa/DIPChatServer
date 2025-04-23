import {Router} from 'express';
const routes = Router();

routes.get('/', (request, response) => {
    response.render('login', {})
})

routes.post('/login', (request, response) => {
    console.log(request.body);
})

export {routes};