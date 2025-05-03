import fs from 'fs/promises';


async function addUserToFile(user, filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const users = JSON.parse(data);

        const userObject = typeof user.userToJSON === 'function'
            ? JSON.parse(user.userToJSON())
            : user;

        users.push(userObject);

        await fs.writeFile(filePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.log(error);
    }
}

export {addUserToFile}