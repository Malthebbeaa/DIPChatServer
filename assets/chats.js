const commentBtn = document.getElementById('commentBtn');
const commentInput = document.getElementById('kommentar');
const removeBtns = document.getElementsByClassName('removeBtns');
const editBtns = document.getElementsByClassName('editBtn');
console.log(removeBtns);

commentBtn.addEventListener('click', async () => {
    if (!checkInput) {
        alert("En kommentar kræver tekst");
        return;
    }

    const tekst = commentInput.value;
    const createDate = new Date().toISOString();
    const response = await fetch(`/chats/message`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            chatId: chatId,
            sender: currentUser,
            tekst: tekst,
            createDate: createDate
        })
    })

    const result = await response.json();

    if (!result.ok) {
        throw new Error(`Fejl: ${result.message}`);
    } else {
        addMessageToDOM(currentUser, tekst, createDate, result.messageId);
        commentInput.value = "";
    }
})

function checkInput() {
    return commentInput.value;
}



Array.from(removeBtns).forEach(button =>{
    button.addEventListener('click', async (event)=>{
        event.preventDefault();

        const messageId = button.getAttribute('data-id');
        const response = await fetch(`/chats/messages/${messageId}`, {
            method: "DELETE",
        })
        const result = await response.json();
        if(!result.ok){
            throw new Error(`Fejl: ${result.message}`);
        }else{
            window.location.href = '/'
        }
    })
})

Array.from(editBtns).forEach(button => {
    button.addEventListener('click', async (event) => {
        event.preventDefault();

        const newText = prompt("Ny besked");
        const messageId = button.getAttribute('data-id');


        if (newText) {
            const response = await fetch(`/chats/message/${messageId}`, {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    newText: newText,
                    chatId: chatId,
                    messageId: messageId
                })
            })

            const result = await response.json();
            console.log(result);

            if(!result.ok) {
                throw new Error(`Fejl: ${result.message}`);
            } else {
                console.log(newText);
                editMessageInDOM(newText, messageId);
            }

        }

    })
})


function addMessageToDOM(sender, tekst, createDate) {
    const messagesContainer = document.querySelector('.messages');
    const banner = document.createElement('div');
    banner.classList.add('banner');

    const img = document.createElement('img');
    img.src = "/user-icon.webp";

    const h5 = document.createElement('h5');
    h5.textContent = `${sender} - ${new Intl.DateTimeFormat('da-DK').format(new Date(createDate))}`;

    const message = document.createElement('div');
    message.classList.add('message');

    const p = document.createElement('p');
    p.textContent = tekst;

    banner.appendChild(img);
    banner.appendChild(h5);
    message.appendChild(p);
    messagesContainer.appendChild(banner);
    messagesContainer.appendChild(message);
}

Array.from(removeBtns).forEach(button =>{
    button.addEventListener('click', async (event)=>{
        event.preventDefault();

        const messageId = button.getAttribute('data-id');
        const chatId = button.getAttribute('data-chatId');
        const response = await fetch(`/chats/messages/${messageId}?chatId=${chatId}`, {
            method: "DELETE"
        })
        const result = await response.json();
        if(!result.ok){
            throw new Error(`Fejl: ${result.message}`);
        }else{
            window.location.href = result.redirect;
        }
    })
})
function editMessageInDOM(nyTekst, messageId) {
    const p = document.getElementById(messageId);
    const newP = document.createElement('p');
    newP.id = messageId;
    newP.textContent = nyTekst;
    p.replaceWith(newP);
}
