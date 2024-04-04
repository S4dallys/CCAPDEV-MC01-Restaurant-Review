const likeOn = "pro-toggle-like"
const dislikeOn = "pro-toggle-dislike"

function selectVote(form, value) {
    const revId = form.getAttribute("data-review")
    const [likeButton, dislikeButton] = form.getElementsByTagName("label")

    if (value === "like") {
        likeButton.classList.add(likeOn)
        dislikeButton.classList.remove(dislikeOn)
    } else if (value === "dislike") {
        likeButton.classList.remove(likeOn)
        dislikeButton.classList.add(dislikeOn)
    } else {
        likeButton.classList.remove(likeOn)
        dislikeButton.classList.remove(dislikeOn)
    }
}

function castVote(id, vote, el) {
    const xhttp = new XMLHttpRequest()
    xhttp.open("POST", "/review/vote", true) 
    xhttp.setRequestHeader("Content-type", "application/json; charset=UTF-8")
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState != 4) {
            return
        }

        if (xhttp.status == 200) {
            el.innerHTML = xhttp.response
            console.log(xhttp.response)
        } else {
            console.log("Server side error!")
        }
    }

    xhttp.send(JSON.stringify({
        "id": id,
        "vote": vote
    }))
}


window.onload = function() {
    const forms = Array.from(document.getElementsByClassName('vote-form'))

    const xhttp = new XMLHttpRequest()
    xhttp.open("GET", "/auth/authorized", true)
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState != 4) {
            return
        }

        for (let i = 0; i < forms.length; i++) {
            forms[i].querySelectorAll("input[name='vote']").forEach(input => {
                if (xhttp.status == 200) {
                    input.addEventListener("change", (e) => {
                        selectVote(forms[i], e.target.value)
                        castVote(forms[i].getAttribute("data-review"), e.target.value, forms[i].getElementsByClassName("pro-like-count")[0])
                    })
                } else {
                    setUpPopup(input, lor_container)
                }
            })
        }
    }

    xhttp.send()

    forms.forEach(f => {
        selectVote(f, f.getAttribute("data-state"))    
    })
}
