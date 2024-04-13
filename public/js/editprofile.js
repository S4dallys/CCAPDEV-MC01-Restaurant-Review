const name = document.getElementById('edit-name')
const desc = document.getElementById('edit-description')
const avatar = document.getElementById('edit-avatar')
const msg = document.getElementById('edit-msg')
const cancel = document.getElementById('edit-cancel')
const save = document.getElementById('edit-save')
const imgShown = document.getElementById('edit-avatar-img')
const img = document.getElementById('lor-user-avatar-link')
const form = document.getElementById('edit-form')

function emptyMsg() {
    msg.innerHTML = ""
}

name.addEventListener('keyup', emptyMsg)
desc.addEventListener('keyup', emptyMsg)
avatar.addEventListener('change', () => {
    const data = new FormData(form)
    const newAvatar = URL.createObjectURL(data.get("avatar"))
    imgShown.setAttribute("src", newAvatar)
})

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const data = new FormData(form)
    let xhttp = new XMLHttpRequest()
    xhttp.open("POST", `/auth/nametaken`, true)

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState != 4) {
            return
        }

        if (xhttp.status == 200) {
            let send = new XMLHttpRequest()
            send.onreadystatechange = () => {
                if (send.readyState != 4) {
                    return
                }

                if (send.status == 200) {
                    msg.innerHTML = "✅ Profile Saved."
                    img.setAttribute("href", `/profile/id/${name.value}`)
                    cancel.setAttribute("href", `/profile/id/${name.value}`)
                } else {
                    msg.innerHTML = "❌ Failed to update. Please Try Again."
                }
            }

            send.open("POST", `/edit/profile`, true)
            send.send(data)
        } else {
            msg.innerHTML = "❌ Name Already Taken."
        }
    }

    xhttp.send(JSON.stringify({ "username": name.value }))

    if (name.value === "") {
        name.classList.add("required-error")
        msg.innerHTML = ""
        return
    } else {
        name.classList.remove("required-error")
    }
})
