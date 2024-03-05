const activeClass = "icon cr-star-i";
const inactiveClass = "icon cr-star-toggle-i";
const stars = Array.from(document.getElementsByClassName("cr-star-i"));

for (let i = 0; i < stars.length; i++) {
    stars[i].setAttribute("onclick", "rateStars(this)");
}

function rateStars(star) {
    let i = stars.indexOf(star);

    for (let j = 0; j < stars.length; j++) {
        stars[j].className = (j <= i) ? activeClass : inactiveClass;
    }
}
