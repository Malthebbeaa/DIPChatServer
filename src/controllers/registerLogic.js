import fs from 'fs/promises';
import { User } from '../models/user.js';

async function addUserToFile(user, filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const users = JSON.parse(data);

        user.id = user.getUserId();

        //Tjek om det er et instans af User, hvis ja gør til plain objekt
        const userObject = typeof user.userToJSON === 'function'
            ? User.fromJSONToObject(user.userToJSON())
            : user;

        users.push(userObject);

        await fs.writeFile(filePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.log(error);
    }
}

export {addUserToFile}