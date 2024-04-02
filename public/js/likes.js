const likeOn = "pro-toggle-like"
const dislikeOn = "pro-toggle-dislike"

function selectVote(form, value, id) {
    const revId = form.getAttribute("data-review")
    const [ likeButton, dislikeButton ] = form.getElementsByTagName("label")

    // check if authenticated
    // ...

    if (value === "like") {
        likeButton.classList.add(likeOn)
        dislikeButton.classList.remove(dislikeOn)
    } else if (value === "dislike") {
        likeButton.classList.remove(likeOn)
        dislikeButton.classList.add(dislikeOn)
    }
}

window.onload = function() {
    const forms = Array.from(document.getElementsByClassName('vote-form'))
    for (let i = 0; i < forms.length; i++) {
        forms[i].querySelector("input[value='like']").addEventListener("change", (ev) => {
            selectVote(forms[i], ev.target.value)
        })

        forms[i].querySelector("input[value='dislike']").addEventListener("change", (ev) => {
            selectVote(forms[i], ev.target.value)
        })
    }
}
