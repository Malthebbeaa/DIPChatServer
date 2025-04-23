const registerButton = document.getElementById("submitBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const retypePasswordInput = document.getElementById('retypepass');
const userlevelSelect = document.getElementById('userlevel');

registerButton.addEventListener('click', async () => {
    if (!checkInputs()) {
        alert("All fields must be filled out!")
    } else if (!checkPassword(passwordInput.value, retypePasswordInput.value)) {
        alert("Passwords has to be the same!");
        clearPasswords();
    } else {
        const response = await fetch('/register', {
            method:"POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value,
                userlevel: userlevelSelect.value
            })
        })
        const result = await response.json();
        if(!result.ok) {
            throw new Error(`Fejl: ${result.message}`);
        } else {
            window.location.href = result.redirect;
        }
    }
})

function checkPassword(password, retype) {
    return password === retype;
}

function clearPasswords() {
    passwordInput.clear;
    retypePasswordInput.clear;
}

function checkInputs() {
    return usernameInput.value || passwordInput.value || retypePasswordInput.value;
}