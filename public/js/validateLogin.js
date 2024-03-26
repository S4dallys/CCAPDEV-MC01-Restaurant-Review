// frontend validation
const regForm = document.getElementById('lor-register-form')
const regUsername = document.getElementById('lor-register-username')
const regPassword = document.getElementById('lor-register-password')
const regConPassword = document.getElementById('lor-register-confirm-password')
const regAlr = document.getElementById('lor-reg-alr')
const regCon = document.getElementById('lor-reg-con')

const logForm = document.getElementById('lor-login-form')
const logUsername = document.getElementById('lor-login-username')
const logPassword = document.getElementById('lor-login-password')
const logAlr = document.getElementById('lor-log-alr')

const normalIcon = "-40px -80px";
const errorIcon = "-60px -80px";

regForm.addEventListener('submit', regValidateContent)
logForm.addEventListener('submit', logValidateContent)

regUsername.addEventListener("keyup", () => {
    let xhttp = new XMLHttpRequest()
    xhttp.open("GET", `/auth/register?username=${regUsername.value}`, true)
    xhttp.send()

    xhttp.onreadystatechange = () => {
        // TODO: fix json error
        const res = JSON.parse(xhttp.response)

        if (res.exists) {
            // say no!
            regAlr.innerHTML = "❌ Already Taken."
        } else {
            regAlr.innerHTML = ""
        }
    }

    resetReg()
})

regPassword.addEventListener("keyup", resetReg)
regConPassword.addEventListener("keyup", resetReg)
logUsername.addEventListener("keyup", resetLog)
logPassword.addEventListener("keyup", resetLog)

function resetReg() {
    regUsername.classList.remove("required-error")
    regPassword.classList.remove("required-error")
    regConPassword.classList.remove("required-error")
}

function resetLog() {
    logUsername.classList.remove("required-error")
    logPassword.classList.remove("required-error")
}

function regValidateContent(e) {
    if (regUsername.value == ""
        || regPassword.value == ""
        || regPassword.value !== regConPassword.value
        || regAlr.innerHTML !== "") {
        // disable button
        e.preventDefault()
        regUsername.classList.add("required-error")
        regPassword.classList.add("required-error")
        regConPassword.classList.add("required-error")

        if (regPassword.value !== regConPassword.value) {
            regCon.innerHTML = "❌ Passwords do not match."
        } else {
            regCon.innerHTML = ""
        }
    }
}

function logValidateContent(e) {
    e.preventDefault()

    let xhttp = new XMLHttpRequest()
    xhttp.open("GET", `/auth/login?username=${logUsername.value}&password=${logPassword.value}`, true)
    xhttp.send()

    xhttp.onreadystatechange = () => {
        // TODO: fix json error
        const res = JSON.parse(xhttp.response)

        if (!res.success) {
            logAlr.innerHTML = "❌ Invalid username or password."
            logUsername.classList.add("required-error")
            logPassword.classList.add("required-error")
        } else {
            logAlr.innerHTML = ""
            logForm.submit()
        }
    }
}
