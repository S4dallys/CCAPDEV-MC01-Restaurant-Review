const setUpPopup = (toggler, popup) => {
    const tog = document.getElementById(toggler)
    const po = document.getElementById(popup)

    if (tog && po) {
        tog.addEventListener("click", () => {
            po.style.display = (po.style.display == "flex") ? "none" : "flex";

            Array.from(po.getElementsByClassName("required-field")).forEach(e => {
               e.classList.remove("required-error") 
            });
        })
    }
}

setUpPopup('lor-popup-open', 'lor-container')
setUpPopup('lor-popup-close', 'lor-container')
setUpPopup('cr-popup-open', 'cr-container')
setUpPopup('cr-popup-close', 'cr-container')
setUpPopup('cr-cancel', 'cr-container')

const logout = document.getElementById('lor-logout')
const logoutform = document.getElementById('lor-logout-form')
if (logoutform) {
    logout.addEventListener("click", () => {
        logoutform.submit()
    })
}
