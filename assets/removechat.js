const removeChatBtns = document.getElementsByClassName("removeChatBtns");

Array.from(removeChatBtns).forEach((button) => {
    button.addEventListener("click", async (event) => {
        event.preventDefault();
        const chatId = button.getAttribute("data-chat-id");
        let acceptDelete = confirm("ønsker du at slette emnet?")
        if(acceptDelete){
            const response = await fetch(`/deletechat/${chatId}`, {
                method: "DELETE"
            })
            const result = await response.json();
            if(!result.ok) {
                throw new Error(`Fejl: ${response.message}`);
            }
            else {
                const subjectElement = button.closest('.post');
                removeSubjectFromDOM(subjectElement);
            }
        } 
    })
})

function removeSubjectFromDOM(subjectElement) {
    if (subjectElement) {
        subjectElement.remove();
    }
}