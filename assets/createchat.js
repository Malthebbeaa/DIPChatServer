const createChatBtn = document.getElementById("createChatBtn");
const chatDescriptionInput = document.getElementById("description-input");
const subjectInput = document.getElementById("subject-input");


createChatBtn.addEventListener("click", async (event) =>{
    event.preventDefault();
    const response = await fetch("/createchat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subject: subjectInput.value,
            description: chatDescriptionInput.value,
            user: user
        })
    })
    const result = await response.json();
    if(!result.ok) {
        throw new Error(`Fejl: ${response.message}`);
    }
    else {
        alert("Chat er oprettet")
        window.location.href = "/"
    }
})

