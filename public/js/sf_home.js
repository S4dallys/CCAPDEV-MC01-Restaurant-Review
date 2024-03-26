const searchBar = document.getElementById('header-search-bar')
const searchParams = new URLSearchParams(window.location.search);
const filter = searchParams.get("filter")

if (filter) {
    searchBar.value = filter
}

// Home
// Sort by: relevance/stars/reviews/release date
// Filter by: stars/reviewcount

// TODO: pagination 20 revs

// filter results
const relevance = {
    minStars: 0,
    maxStars: 5,
    minReviewCount: 0,
    maxReviewCount: 5,
    setupWeights: function(minStars, maxStars, minReviewCount, maxReviewCount) {
        this.minStars = minStars
        this.maxStars = maxStars
        this.minReviewCount = minReviewCount
        this.maxReviewCount = maxReviewCount
    },
    getRelevance: function(reviews, stars) {
        const reviewWeight = 0.5
        const starWeight = 0.5

        let reviewNorm = this.maxReviewCount - this.minReviewCount
        let starNorm = this.maxStars - this.maxStars

        if (reviewNorm == 0) {
            reviewNorm = 1
        }

        if (starNorm == 0) {
            starNorm = 1
        }

        const normalizedReviewCount = (reviews - this.minReviewCount) / reviewNorm
        const normalizedStars = (stars - this.minStars) / starNorm

        return (reviewWeight * normalizedReviewCount) + (starWeight * normalizedStars)
    },
}

function Resto(stars, rc, e) {
    this.stars = stars
    this.revCount = rc
    this.relevance = 0
    this.element = e
}

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('p1-restaurants-list')
    const initRestos = Array.from(document.querySelectorAll('#p1-restaurants-list > li'))
    let restos = []
    let currentRestos = []

    if (!initRestos) {
        return
    }

    let minStars = initRestos[0].getElementsByClassName("cr-star-group")[0].getAttribute("data-stars")
    let maxStars = minStars
    let minRevs = initRestos[0].getElementsByClassName("p1-reviews")[0].getAttribute("data-reviews")
    let maxRevs = minRevs

    initRestos.forEach((e) => {
        const newE = new Resto(
            e.getElementsByClassName("cr-star-group")[0].getAttribute("data-stars"),
            e.getElementsByClassName("p1-reviews")[0].getAttribute("data-reviews"),
            e
        )

        newE.relevance = relevance.getRelevance(newE.revCount, newE.stars)

        if (newE.stars > maxStars) {
            maxStars = newE.stars
        }

        if (newE.stars < minStars) {
            minStars = newE.stars
        }

        if (newE.revCount > maxRevs) {
            maxRevs = newE.revCount
        }

        if (newE.revCount < minRevs) {
            minRevs = newE.revCount
        }

        restos.push(newE)
    })

    relevance.setupWeights(
        minStars, maxStars, minRevs, maxRevs
    )

    const sortBy = document.getElementById('sf-sort-select')
    const filterMin = document.getElementById('lstar')
    const filterMax = document.getElementById('hstar')
    const flip = document.getElementById('sf-sort-flip')

    function refresh(arr) {
        container.innerHTML = ""
        arr.forEach((e) => {
            container.appendChild(e.element)
        })
    }

    function sortFunction() {
        const val = sortBy.value
        const order = flip.getAttribute("data-flip")
        if (val === "relevance") {
            currentRestos.sort((a, b) => {
                return b.relevance - a.relevance
            })
        } else if (val === "stars") {
            currentRestos.sort((a, b) => {
                return b.stars - a.stars
            })
        } else if (val === "reviews") {
            currentRestos.sort((a, b) => {
                return b.revCount - a.revCount
            })
        }

        if (order === "asc") {
            currentRestos.reverse()
        }

        refresh(currentRestos)
    }

    function filterFunction() {
        currentRestos = restos.filter((e) => {
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

    currentRestos = [...restos]
    sortFunction()
});
