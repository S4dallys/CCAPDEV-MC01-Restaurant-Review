// Reviews
// Sort by: erms/likes/post date
// Filter by: stars/ hasOR

// filter results
function Review(erms, stars, date, hasOr, e) {
    this.erms = erms
    this.stars = stars
    this.date = date
    this.hasOr = hasOr
    this.element = e
}

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('pro-review-ul')
    const initReviews = Array.from(document.querySelectorAll('#pro-review-ul > li'))
    let reviews = []
    let currentReviews = []

    if (!initReviews) {
        return
    }

    initReviews.forEach((e) => {
        const newE = new Review(
            e.getElementsByClassName("pro-review-header")[0].getAttribute("data-erms"),
            e.getElementsByClassName("cr-star-group")[0].getAttribute("data-stars"),
            e.getElementsByClassName("pro-user-date")[0].getAttribute("data-date"),
            e.getElementsByClassName("pro-or-box").length == 0 ? false : true,
            e
        )
        reviews.push(newE)
    })

    const sortBy = document.getElementById('sf-sort-select')
    const filterMin = document.getElementById('lstar')
    const filterMax = document.getElementById('hstar')
    const flip = document.getElementById('sf-sort-flip')

    function refresh(arr) {
        console.log(arr)
        container.innerHTML = ""
        arr.forEach((e) => {
            container.appendChild(e.element)
        })
    }

    function sortFunction() {
        const val = sortBy.value
        const order = flip.getAttribute("data-flip")
        if (val === "relevance") {
            currentReviews.sort((a, b) => {
                return b.erms - a.erms
            })
        } else if (val === "likes") {
            currentReviews.sort((a, b) => {
                return b.likes - a.likes
            })
        } else if (val === "date") {
            currentReviews.sort((a, b) => {
                return new Date(b.date) - new Date(a.date)
            })
        }

        if (order === "asc") {
            currentReviews.reverse()
        }

        refresh(currentReviews)
    }

    function filterFunction() {
        currentReviews = reviews.filter((e) => {
            return e.stars >= filterMin.value && e.stars <= filterMax.value
        })

        sortFunction()
    }

    sortBy.addEventListener('change', sortFunction)
    filterMin.addEventListener('change', filterFunction)
    filterMax.addEventListener('change', filterFunction)

    flip.addEventListener('click', () => {
        if (flip.getAttribute("data-flip") === "asc") {
            flip.className = "icon sort-desc-i icon-md"
            flip.setAttribute("data-flip", "desc")
        } else {
            flip.className = "icon sort-asc-i icon-md"
            flip.setAttribute("data-flip", "asc")
        }

        sortFunction()
    })

    currentReviews = [...reviews]
    sortFunction()
});





