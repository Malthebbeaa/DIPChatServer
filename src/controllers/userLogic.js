import fs from 'fs/promises';

export {handleEditUserLevel}

async function handleEditUserLevel(newUserLevel, userId, filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const users = JSON.parse(data);
        const user = users.find(user => user.id === userId);

        user.userlevel = newUserLevel;

        await fs.writeFile(filePath, JSON.stringify(users, null, 2));

    } catch (error) {
        console.error(error);
    }
}

