function generateStars(score) {
    let stars = []
    const isHalf = (score % 1 != 0)

    let star

    for (let i = 0; i < 5; i++) {
        star = document.createElement('li') 

        if (i < score) {
            star.classList.add('icon', 'icon-md', 'g-star')
        } else {
            star.classList.add('icon', 'icon-md', 'g-star-toggle')
        }

        stars.push(star)
    }

    if (isHalf) {
        stars[score - 0.5].classList.remove('g-star-toggle')
        stars[score - 0.5].classList.add('g-star-half')
    }

    return stars
}
