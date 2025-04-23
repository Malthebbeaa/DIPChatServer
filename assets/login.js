const loginButton = document.querySelector('.loginButton')
const user = document.querySelector('.username')
const pass = document.querySelector('.password')


console.log(loginButton);

loginButton.addEventListener('click', async() =>{
    const response = await fetch('/login', {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            username: user.value,
            password: pass.value
        })
    })
    const result = await response.json();
    if(result.ok && result.redirect){
        window.location.href = result.redirect
    } else{
        alert(result.message)
    }
})