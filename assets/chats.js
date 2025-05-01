const commentBtn = document.getElementById('commentBtn');
const commentInput = document.getElementById('kommentar');
const removeBtns = document.getElementsByClassName('removeBtns');
const editBtns = document.getElementsByClassName('editBtn');

commentBtn.addEventListener('click', async () => {
    if (!checkInput()) {
        alert("En kommentar kræver tekst");
    } else {
        const tekst = commentInput.value;
        const postResponse = await fetch(`/chats/message`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                chatId: chatId,
                sender: currentUser,
                tekst: tekst,
            })
        })

        const postResult = await postResponse.json();

        if (!postResult.ok) {
            throw new Error(`Fejl: ${postResult.message}`);
        } else {
            addMessageToDOM(currentUser, postResult.message.text, postResult.message.createDate, postResult.messageId);
        }
    }
})

function checkInput() {
    return commentInput.value;
}



Array.from(removeBtns).forEach(button =>{
    button.addEventListener('click', async (event)=>{
        event.preventDefault();
        const messageId = button.getAttribute('data-id');
        let acceptDelete = confirm("ønsker du at slette beskeden?")
        if(acceptDelete){
            let response = await fetch(`/chats/messages/${messageId}`, {
            method: "DELETE"
            })
            const result = await response.json();
            if(!result.ok){
                throw new Error(`Fejl: ${result.message}`);
            }else{
                deleteMessageInDOM(messageId)
            }
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


function addMessageToDOM(sender, tekst, createDate, messageId) {
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

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Rediger';
    editBtn.className = 'editBtn';
    editBtn.setAttribute("data-id", messageId)

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Slet';
    deleteBtn.className = "removeBtns";
    deleteBtn.setAttribute("data-id",messageId);

    banner.appendChild(img);
    banner.appendChild(h5);
    message.appendChild(p);
    messagesContainer.appendChild(banner);
    messagesContainer.appendChild(message);
    messagesContainer.appendChild(editBtn);
    messagesContainer.appendChild(deleteBtn);
}

function editMessageInDOM(nyTekst, messageId) {
    const p = document.getElementById(messageId);
    const newP = document.createElement('p');
    newP.id = messageId;
    newP.textContent = nyTekst;
    p.replaceWith(newP);
}

function deleteMessageInDOM(messageId){
    const p = document.getElementById(messageId)
    const divParent = p.parentNode
    divParent.remove();
}