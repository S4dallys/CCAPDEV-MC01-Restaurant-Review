const setUpPopup = (toggler, popup) => {
    const tog = document.getElementById(toggler)
    const po = document.getElementById(popup)

    if (tog && po) {
        tog.addEventListener("click", () => {
            po.style.display = (po.style.display == "flex") ? "none" : "flex";
        })
    }
}

setUpPopup('lor-popup-open', 'lor-container')
setUpPopup('lor-popup-close', 'lor-container')
setUpPopup('cr-popup-open', 'cr-container')
setUpPopup('cr-popup-close', 'cr-container')
setUpPopup('cr-cancel', 'cr-container')

