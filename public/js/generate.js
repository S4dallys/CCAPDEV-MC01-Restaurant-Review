// generate dates
const dateTags = document.querySelectorAll("span[data-date]")
dateTags.forEach((d) => {
    d.innerText = generateDate(d.getAttribute("data-date"))
})

// generate stars
const starTags = document.querySelectorAll("ul[data-stars]")
starTags.forEach((s) => {
    s.append(...generateStars(s.getAttribute("data-stars")))
})

// functions
function generateDate(date) {
    const formattedDate = new Date(date).toLocaleDateString('en-PH', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
    });

    return `(${formattedDate.toString()})`
}

function generateStars(score) {
    // in case there are no reviews
    if (isNaN(score)) { score = 0 }

    //round to nearest half
    score = Math.round(score * 2) / 2

    let stars = []
    const isHalf = (score % 1 != 0)

    for (let i = 0; i < 5; i++) {
        const star = document.createElement("li")

        if (i < score) {
            star.classList.add('icon', 'icon-md', 'g-star');
        } else {
            star.classList.add('icon', 'icon-md', 'g-star-toggle');
        }

        stars.push(star)
    }

    if (isHalf) {
        stars[score - 0.5].classList.remove('g-star-toggle')
        stars[score - 0.5].classList.add('g-star-half')
    }

    return stars
}
