const removeSubjectBtns = document.getElementsByClassName("removeSubjectBtns");

Array.from(removeSubjectBtns).forEach((button) => {
    button.addEventListener("click", async (event) => {
        event.preventDefault();
        const subjectId = button.getAttribute("data-subject-id");
        let acceptDelete = confirm("ønsker du at slette emnet?")
        if(acceptDelete){
            const response = await fetch(`/deletesubject/${subjectId}`, {
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