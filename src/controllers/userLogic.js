const editUserLevelBtn = document.getElementsByClassName('editULevelBtn')

editUserLevelBtn.addEventListener('click', async (event) =>{
    event.preventDefault();
    let newUserLevel = prompt("Indtast nyt Userlevel")

    const response = await fetch('/users/userId',{
        method: "PUT",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            newUserLevel: newUserLevel,
            user: userId
        })
    })
    const result = await response.json();

    if(!result.ok){
        throw new Error(`Fejl: ${result.message}`);
    } else{
        window.location.href = result.redirect;
    }
})

