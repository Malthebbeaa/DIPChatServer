import fs from 'fs/promises';

export {handleNewSubject, deleteSubject}

async function handleNewSubject(subject, filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const chats = JSON.parse(data);

        chats.push(subject);

        await fs.writeFile(filePath, JSON.stringify(chats, null, 2))
    } catch (error) {
        console.error(error)
    }
}

async function deleteSubject(subjectIndex, filePath){
    try{
        const data = await fs.readFile(filePath, 'utf8');
        const chats = JSON.parse(data);

        chats.splice(subjectIndex, 1);

        await fs.writeFile(filePath, JSON.stringify(chats, null, 2))
    } catch (error) {
        console.error(error)
    }
}