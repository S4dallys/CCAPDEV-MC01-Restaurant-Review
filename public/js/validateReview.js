const form = document.getElementById('cr-form')
const title = document.getElementById('cr-title')
const body = document.getElementById('cr-content')
const button = document.getElementById('cr-post')

const file = document.getElementById("cr-file")
const label = document.getElementById("cr-upload-text")
const icon = document.getElementsByClassName("cr-img-i")[0]

const normalIcon = "-40px -80px";
const errorIcon = "-60px -80px";

file.addEventListener("change", validateFilesLength);
form.addEventListener('submit', validateReviewContent)

function validateReviewContent(e) {
    if (title.value == "" || body.value == "" ){
        // disable button
        e.preventDefault()
        title.classList.add("required-error")
        body.classList.add("required-error")
    } else {
        // enable button
        title.classList.remove("required-error")
        body.classList.remove("required-error")
    }

    if (file.files.length > 4) {
        e.preventDefault() 
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
}
