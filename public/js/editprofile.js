const name = document.getElementById('edit-name')
const desc = document.getElementById('edit-description')
const avatar = document.getElementById('edit-avatar')
const msg = document.getElementById('edit-msg')
const cancel = document.getElementById('edit-cancel')
const save = document.getElementById('edit-save')

save.addEventListener("click", () => {
    let xhttp = new XMLHttpRequest()
    xhttp.open("GET", `/auth/register?username=${name.value}`, true)
    xhttp.send()

    xhttp.onreadystatechange = () => {
        // TODO: fix json error
        const res = JSON.parse(xhttp.response)

        if (res.exists) {
            // say no!
            msg.innerHTML = "❌ Name Already Taken."
        } else {
            // TODO: get check mark
            msg.innerHTML = "v Profile Saved."

            // TODO: post new username
        }
    }
})


