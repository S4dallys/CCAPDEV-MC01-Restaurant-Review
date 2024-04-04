const setUpPopup = (tog, po) => {
    if (tog && po) {
        tog.addEventListener("click", () => {
            po.style.display = (po.style.display == "flex") ? "none" : "flex";

            Array.from(po.getElementsByClassName("required-field")).forEach(e => {
                e.classList.remove("required-error")
            });
        })
    }
}

const cr_container = document.getElementById('cr-container')
const cr_popup_open = document.getElementById('cr-popup-open')
const cr_popup_close = document.getElementById('cr-popup-close')
const cr_cancel = document.getElementById('cr-cancel')
const lor_container = document.getElementById('lor-container')
const lor_popup_open = document.getElementById('lor-popup-open')
const lor_popup_close = document.getElementById('lor-popup-close')

const logout = document.getElementById('lor-logout')
const logoutform = document.getElementById('lor-logout-form')

// ajax request for authentication
let xhttp = new XMLHttpRequest()

xhttp.open("GET", "/auth/authorized", true)
xhttp.onreadystatechange = () => {
    if (xhttp.readyState != 4) {
        return
    }

    if (xhttp.status == 200) {
        setUpPopup(cr_popup_open, cr_container)
        setUpPopup(cr_popup_close, cr_container)
        setUpPopup(cr_cancel, cr_container)
    } else {
        setUpPopup(cr_popup_open, lor_container)
        setUpPopup(cr_popup_close, lor_container)
        setUpPopup(cr_cancel, lor_container)
    }
}

xhttp.send()

setUpPopup(lor_popup_open, lor_container)
setUpPopup(lor_popup_close, lor_container)

if (logoutform) {
    logout.addEventListener("click", () => {
        logoutform.submit()
    })
}
