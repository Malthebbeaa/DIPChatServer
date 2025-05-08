const deleteBtns = document.getElementsByClassName('deleteBtns')
console.log(deleteBtns);

Array.from(deleteBtns).forEach(button =>{
    button.addEventListener('click', async (event)=>{
        event.preventDefault();
        const messageId = button.getAttribute('data-id')
        console.log(messageId);
        let acceptDelete = confirm("ønsker du at slette beskeden?")
        if(acceptDelete){
            let response = await fetch(`/chats/messages/${messageId}`,{
                method: "DELETE"    
            })
            const result = await response.json();
            if(!result.ok){
                throw new Error(`Fejl: ${result.message}`);
            }else{
                let div = button.closest('.flex-container')
                deleteMessageInDOM(div)
            }
        }
    })
})

function deleteMessageInDOM(div){
    if(div){
        div.remove();
    }
}