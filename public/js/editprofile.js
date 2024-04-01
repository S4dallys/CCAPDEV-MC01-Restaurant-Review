const name = document.getElementById('edit-name')
const desc = document.getElementById('edit-description')
const avatar = document.getElementById('edit-avatar')
const msg = document.getElementById('edit-msg')
const cancel = document.getElementById('edit-cancel')
const save = document.getElementById('edit-save')
const img = document.getElementById('lor-user-avatar-link')

function emptyMsg() {
    msg.innerHTML = ""
}

name.addEventListener('keyup', emptyMsg)
desc.addEventListener('keyup', emptyMsg)
save.addEventListener("click", () => {
    let xhttp = new XMLHttpRequest()
    xhttp.open("GET", `/auth/register?username=${name.value}`, true)
    xhttp.send()

    if (name.value === "") {
        name.classList.add("required-error")
        msg.innerHTML = ""
        return
    } else {
        name.classList.remove("required-error")
    }

    xhttp.onreadystatechange = () => {
        // TODO: fix json error
        const res = JSON.parse(xhttp.response)

        if (res.exists) {
            // say no!
            msg.innerHTML = "❌ Name Already Taken."
        } else {
            let send = new XMLHttpRequest()
            send.open("GET", `/edit/update?username=${name.value}&description=${desc.value}`, true)
            send.send()

            send.onreadystatechange = () => {
                // TODO: fix json error
                const res2 = JSON.parse(send.response)

                if (res2.success) {
                    msg.innerHTML = "✅ Profile Saved."
                    img.setAttribute("href", `/profile/id/${name.value}`)
                    cancel.setAttribute("href", `/profile/id/${name.value}`)
                } else {
                    msg.innerHTML = "❌ Failed to update. Pleaser Try Again."
                }
            }
        }
    }
})


