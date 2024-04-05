const posts = Array.from(document.getElementsByClassName('pro-review-box'))
const orposts = Array.from(document.getElementsByClassName('pro-or-text'))

posts.forEach(p => {
    p.addEventListener("click", expandPost)
})

orposts.forEach(p => {
    p.addEventListener("click", expandPost)
})

function expandPost(e) {
    if (!e.target.classList.contains("post-expanded")) {
        e.target.classList.add("post-expanded")
    } else {
        e.target.classList.remove("post-expanded")
    }
}

