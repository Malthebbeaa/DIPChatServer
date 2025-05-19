const editUserLevelBtn = document.querySelector('.editULevelBtn')


editUserLevelBtn.addEventListener('click', async (event) =>{
    event.preventDefault();
    let newUserLevel = prompt("Indtast nyt Userlevel (mellem 1-3)")

    if(!newUserLevel) return;
    if(!checkNewUserlevel(Number(newUserLevel))) {
        alert("Userlevel skal være mellem 1-3!");
        return;
    }

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
        editUserLevelInDOM(newUserLevel, userId);
    }
})

function editUserLevelInDOM(newUserLevel) {
    const userLevelElement = document.querySelector('.userLevel');
    userLevelElement.textContent = "User Level: " + newUserLevel;  
}

function checkNewUserlevel(userlevel) {
    const legalLevels = [1,2,3]
    return legalLevels.includes(userlevel);
}