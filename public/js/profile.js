// TODO: uhhh this?? change classnames...
const toggleLike = (like) => {
    like.className = (like.className === "icon pro-like") ? "icon pro-toggle-like" : "icon pro-like";
}
const toggleDislike = (dislike) => {
    dislike.className = (dislike.className === "icon pro-dislike") ? "icon pro-toggle-dislike" : "icon pro-dislike";
}

window.onload = function() {
    const likes = document.getElementsByClassName("pro-like");
    const dislikes = document.getElementsByClassName("pro-dislike");
    
    for (let i = 0; i < likes.length; i++) {
        likes[i].setAttribute("onclick", "toggleLike(this)");
        dislikes[i].setAttribute("onclick", "toggleDislike(this)");
    }
}
