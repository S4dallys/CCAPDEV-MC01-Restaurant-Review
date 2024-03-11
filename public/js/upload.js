const file = document.getElementById("cr-file")
const label = document.getElementById("cr-upload-text")
const icon = document.getElementsByClassName("cr-img-i")[0]

const normalIcon = "-40px -80px";
const errorIcon = "-60px -80px";

file.addEventListener("change", function() {
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
});
