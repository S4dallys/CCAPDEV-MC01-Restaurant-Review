const title = document.getElementById('edit-title')
const content = document.getElementById('edit-content')
const msg = document.getElementById('edit-msg')
const cancel = document.getElementById('edit-cancel')
const save = document.getElementById('edit-save')
const del = document.getElementById('edit-delete')
const form = document.getElementById('edit-form')
const rating = document.getElementById('cr-star-input')

const no = document.getElementById('delete-no')
const deletePopup = document.getElementById('delete-popup')

const file = document.getElementById("cr-file")
const label = document.getElementById("cr-upload-text")
const icon = document.getElementsByClassName("cr-img-i")[0]
const oldImages = label.getAttribute("data-oldImages")

const revId = form.getAttribute("data-id")

function emptyMsg() {
    msg.innerHTML = ""
}

const openDel = (tog, po) => {
    if (tog && po) {
        tog.addEventListener("click", () => {
            po.style.display = (po.style.display == "flex") ? "none" : "flex";

            Array.from(po.getElementsByClassName("required-field")).forEach(e => {
                e.classList.remove("required-error")
            });
        })
    }
}

openDel(no, deletePopup)
openDel(del, deletePopup)

title.addEventListener('keyup', emptyMsg)

file.addEventListener("change", validateFilesLength);
file.addEventListener("click", validateFilesLength);
form.addEventListener('submit', validateReviewContent)

cancel.addEventListener('click', ev => {
    file.setAttribute("data-changed", "false")
})

const deleteForm = document.getElementById('delete-yes')
deleteForm.addEventListener("click", (e) => { deleteForm.submit() })

if (oldImages > 0) {
    label.style.color = "var(--col-prim)"
    label.innerText = oldImages + " IMGS"
    icon.style.backgroundPosition = normalIcon
}

function validateReviewContent(e) {
    e.preventDefault()
    if (file.files.length > 4) {
        return
    }

    if (title.value == "") {
        title.classList.add("required-error")
    } else {
        title.classList.remove("required-error")
        submitForm()
    }
}

function validateFilesLength() {
    const numImages = file.files.length
    label.innerText = numImages + " IMGS"

    if (numImages == 0) {
        label.style.color = "white"
        icon.style.backgroundPosition = normalIcon
    } else if (numImages < 5) {
        label.style.color = "var(--col-prim)"
        icon.style.backgroundPosition = normalIcon
    } else {
        label.style.color = "var(--col-error)"
        icon.style.backgroundPosition = errorIcon
        label.innerText = "MAX 4 IMGS"
    }

    file.setAttribute("data-changed", "true")
}

function submitForm() {
    const data = new FormData(form)
    data.append("id", revId)
    data.append("imagesChanged", file.getAttribute("data-changed"))

    let xhttp = new XMLHttpRequest()
    xhttp.open("POST", `/edit/review`, true)

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState != 4) {
            return
        }

        if (xhttp.status == 200) {
            msg.innerHTML = "✅ Changes Saved."
        } else {
            msg.innerHTML = "❌ Failed to update. Please Try Again."
        }
    }

    xhttp.send(data)
}
