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
const logRememberMe = document.getElementById('lor-remember-me')

const normalIcon = "-40px -80px";
const errorIcon = "-60px -80px";

regForm.addEventListener('submit', regValidateContent)
logForm.addEventListener('submit', logValidateContent)

regUsername.addEventListener("keyup", () => {
    let xhttp = new XMLHttpRequest()
    xhttp.open("POST", `/auth/nametaken`, true)
    xhttp.setRequestHeader("Content-type", "application/json; charset=UTF-8")

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState != 4) {
            return
        }

        if (xhttp.status == 200) {
            regAlr.innerHTML = ""
        } else {
            regAlr.innerHTML = "❌ Already Taken."
        }
    }

    xhttp.send(JSON.stringify({ "username": regUsername.value, }))
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
    xhttp.open("POST", `/auth/validatecredentials`, true)
    xhttp.setRequestHeader("Content-type", "application/json; charset=UTF-8")
    xhttp.withCredentials = true

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState != 4) {
            return
        }

        if (xhttp.status == 200) {
            logAlr.innerHTML = ""
            logForm.submit()
        } else {
            logAlr.innerHTML = "❌ Invalid Credentials."
            logUsername.classList.add("required-error")
            logPassword.classList.add("required-error")
        }
    }

    console.log(logRememberMe.checked)

    xhttp.send(JSON.stringify({
        "username": logUsername.value,
        "password": logPassword.value,
        "rememberMe": logRememberMe.checked
    }))

}
