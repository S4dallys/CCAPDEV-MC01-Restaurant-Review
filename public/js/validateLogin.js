// frontend validation
const regForm = document.getElementById('lor-register-form')
const regUsername = document.getElementById('lor-register-username')
const regPassword = document.getElementById('lor-register-password')
const regConPassword = document.getElementById('lor-register-confirm-password')
const regAlr = document.getElementById('lor-reg-alr')

const logForm = document.getElementById('lor-login-form')
const logUsername = document.getElementById('lor-login-username')
const logPassword = document.getElementById('lor-login-password')
const logAlr = document.getElementById('lor-log-alr')

const normalIcon = "-40px -80px";
const errorIcon = "-60px -80px";

regForm.addEventListener('submit', regValidateContent)
logForm.addEventListener('submit', logValidateContent)

function regValidateContent(e) {
    if (regUsername.value == "" || regPassword.value == "" || regPassword.value !== regConPassword.value ){
        // disable button
        e.preventDefault()
        regUsername.classList.add("required-error")
        regPassword.classList.add("required-error")
        regConPassword.classList.add("required-error")
    } else {
        // enable button
        regUsername.classList.remove("required-error")
        regPassword.classList.remove("required-error")
        regConPassword.classList.remove("required-error")
    }
}

function logValidateContent(e) {
    if (logUsername.value == "" || logPassword.value == ""){
        // disable button
        e.preventDefault()
        logUsername.classList.add("required-error")
        logPassword.classList.add("required-error")
    } else {
        // enable button
        logUsername.classList.remove("required-error")
        logPassword.classList.remove("required-error")
    }
}
