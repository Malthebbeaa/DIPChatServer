const commentBtn = document.getElementById('commentBtn');
const commentInput = document.getElementById('kommentar');
const removeBtns = document.getElementsByClassName('removeBtns');
const editBtns = document.getElementsByClassName('editBtn');
const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const messages = document.querySelectorAll('.message');

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
            commentInput.value = "";
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
                button.closest('.message')
                deleteMessageInDOM(messageId)
            }
        }
    })
})




Array.from(editBtns).forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();

        const messageId = button.getAttribute('data-id');
        const currentText = document.getElementById(messageId).textContent;

        editInput.value = currentText;

        editModal.classList.remove('hidden');

        saveEditBtn.onclick = async () => {
            const newText = editInput.value;

            if (newText) {
                const response = await fetch(`/chats/message/${messageId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        newText: newText,
                        chatId: chatId,
                        messageId: messageId
                    })
                });

                const result = await response.json();

                if (!result.ok) {
                    throw new Error(`Fejl: ${result.message}`);
                } else {
                    editMessageInDOM(newText, messageId);
                    editModal.classList.add('hidden');
                }
            }
        };

        cancelEditBtn.onclick = () => {
            editModal.classList.add('hidden'); 
        };
    });
});

Array.from(messages).forEach(message => {
    const p = message.querySelector('p');
    p.addEventListener('click', async () => {
        const messageId = p.getAttribute('id');
        window.location.href = `/chats/messages/${messageId}`;
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

    // Message
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    const p = document.createElement('p');
    p.id = messageId;
    p.textContent = tekst;
    messageDiv.appendChild(p);

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'editBtn';
    editBtn.setAttribute("data-id", messageId);
    const editImg = document.createElement('img');
    editImg.src = "/edit-icon.webp";
    editImg.alt = "editicon";
    editImg.className = "edit";
    editBtn.appendChild(editImg);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = "removeBtns";
    deleteBtn.setAttribute("data-id", messageId);
    const deleteImg = document.createElement('img');
    deleteImg.src = "/delete.svg";
    deleteImg.alt = "deleteicon";
    deleteImg.className = "delete";
    deleteBtn.appendChild(deleteImg);


    //indre container som ring om
    const innerContainer = document.createElement('div');
    innerContainer.className = "messagecontainer";
    innerContainer.appendChild(banner);
    innerContainer.appendChild(messageDiv);
    innerContainer.appendChild(editBtn);
    innerContainer.appendChild(deleteBtn);

    banner.appendChild(img);
    banner.appendChild(h5);
    messagesContainer.appendChild(innerContainer);
}

function editMessageInDOM(nyTekst, messageId) {
    const p = document.getElementById(messageId);
    p.textContent = nyTekst;
}

function deleteMessageInDOM(messageId){
    const p = document.getElementById(messageId)
    const divParent = p.parentNode
    const messagesContainer = divParent.parentNode;
    messagesContainer.remove();
}