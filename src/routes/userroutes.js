import {Router} from 'express';
import {chats, users} from '../../app.js'
import { handleEditUserLevel } from '../../src/controllers/userLogic.js'

const userRouter = Router();


userRouter.get('/', (request, response) =>{
    response.render('users', {users: users})
})

userRouter.get('/:id', (request, response)=> {
    let userInfo = users.find(u => u.username == request.params.id)
    response.render('userinfo', {userInfo: userInfo})
})

userRouter.get('/:id/messages', (request, response)=>{
    let userInfo = users.find(u => u.username == request.params.id)
    let userchats = findUserChats(userInfo)
    let chatOwner = chats.filter(co => co.owner == userInfo.username)
    response.render('messages',{userInfo: userInfo, chat: chats, userchats: userchats, chatOwner: chatOwner})
})

userRouter.put('/:id', (request, response) =>{
    const {newUserLevel, user} = request.body;
    handleEditUserLevel(newUserLevel, user,'./FILES/users.json');

    response.status(200).send({
        ok:true,
        message: "der er ændret i userlevel"
    })
})

function findUserChats(user){
    return chats.flatMap(chat => chat.messages.filter((u)=> u.sender == user.username))
}

export{userRouter}