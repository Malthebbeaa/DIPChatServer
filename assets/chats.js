const commentBtn = document.getElementById('commentBtn');
const commentInput = document.getElementById('kommentar');

commentBtn.addEventListener('click', async () => {
    if (!checkInput) {
        alert("En kommentar kræver tekst");
    }

    const tekst = commentInput.value;
    console.log(chatId + " " + currentUser + " " + tekst);
    const response = await fetch(`/chats/message`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: {
            chatId: chatId,
            sender: currentUser,
            tekst: tekst
        }
    })

    const result = await response.json();

    if (!result.ok) {
        throw new Error(`Fejl: ${result.message}`);
    } else {
        window.location.reload();
    }
})

function checkInput() {
    return commentInput.value;
}