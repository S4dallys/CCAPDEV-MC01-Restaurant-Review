const starInput = document.getElementById("cr-star-input")

const activeClass = "icon icon-md g-star";
const inactiveClass = "icon icon-md g-star-toggle";
const halfClass = "icon icon-md g-star-half"
let stars = []

document.addEventListener('DOMContentLoaded', () => {
    stars = Array.from(document.querySelectorAll("#g-ul-clickable li"))

    for (let i = 0; i < stars.length; i++) {
        stars[i].setAttribute("onclick", "rateStars(this)");
    }
})

function rateStars(star) {
    let i = stars.indexOf(star);
    const currentStarRating = starInput.getAttribute("value")

    console.log(currentStarRating)
    console.log(i)

    if (i == currentStarRating - 1) {
        stars[i].className = halfClass
        starInput.setAttribute("value", `${i + 0.5}`)
    } else {
        for (let j = 0; j < stars.length; j++) {
            stars[j].className = (j <= i) ? activeClass : inactiveClass;
        }
        starInput.setAttribute("value", `${i + 1}`)
    }
}

