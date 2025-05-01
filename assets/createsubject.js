const createSubjectBtn = document.getElementById("createSubjectBtn");
const subjectDescriptionInput = document.getElementById("description-input");
const subjectInput = document.getElementById("subject-input");

createSubjectBtn.addEventListener("click", async (event) =>{
    event.preventDefault();
    const response = await fetch("/createsubject", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subject: subjectInput.value,
            description: subjectDescriptionInput.value,
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