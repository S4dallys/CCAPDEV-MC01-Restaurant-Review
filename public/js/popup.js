const setUpPopup = (toggler, popup) => {
    const tog = document.getElementById(toggler)
    const po = document.getElementById(popup)

    if (tog && po) {
        tog.addEventListener("click", () => {
            po.style.display = (po.style.display == "none") ? "flex" : "none";
        })
    }
}

const popups = document.getElementsByClassName("popup")
for (let i = 0; i < popups.length; i++) {
    popups[i].style.display = "none"
}

setUpPopup('lor-popup-open', 'lor-container')
setUpPopup('lor-popup-close', 'lor-container')
setUpPopup('cr-popup-open', 'cr-container')
setUpPopup('cr-popup-close', 'cr-container')
setUpPopup('cr-cancel', 'cr-container')

