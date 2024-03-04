const togglePopup = (id) => {
    const popup = document.getElementById(id);
    popup.style.display = (popup.style.display == "none") ? "flex" : "none";
}
