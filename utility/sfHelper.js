const query = require('../utility/query');

// Home
// Sort by: relevance/stars/reviews/release date
// Filter by: stars/reviewcount

const sfHelper = {
    sortFilterHome: sortFilterHome,
    sortFilterReviews: function() { }
}

async function sortFilterHome(restos, min, max, sort, order) {
    let [ minStars, maxStars, minRevs, MaxRevs ] = [null, null, null, null]

    await Promise.all(restos.map(async (r) => {
        const reviews = await query.getReviews({ restoId: r._id });
        const reviewCount = reviews.length;
        r.reviewCount = reviewCount;
        r.stars = reviewCount > 0 ? reviews.reduce((total, rev) => total + rev.stars, 0) / reviewCount : 0;

        // first run
        if (minStars == null) {
            minStars = r.stars
            maxStars = r.stars
            minRevs = r.reviewCount
            maxRevs = r.reviewCount
        }

        minStars = Math.min(minStars, r.stars)
        maxStars = Math.min(maxStars, r.stars)
        minRevs = Math.min(minRevs, r.reviewCount)
        maxRevs = Math.min(maxRevs, r.reviewCount)
    }))

    let newRestos = restos.filter(r => r.stars >= min && r.stars <= max)

    newRestos.sort((a, b) => {
        if (sort === "relevance") {
            const relevance = new Relevance(minStars, maxStars, minRevs, MaxRevs)
            return relevance.getRelevance(b.stars, b.reviewCount) - relevance.getRelevance(a.stars, a.reviewcount)
        } else if (sort === "reviews") {
            return b.reviewCount - a.reviewCount
        } 
    })

    if (order === "asc") {
        return newRestos.reverse()
    } else if (order === "desc") {
        return newRestos
    }
}

function Relevance(minOne, maxOne, minTwo, maxTwo) {
    this.minOne = minOne
    this.maxOne = maxOne
    this.minTwo = minTwo
    this.maxTwo = maxTwo

    this.getRelevance = function(one, two) {
        const oneWeight = 0.5
        const twoWeight = 0.5

        let oneNorm = this.maxOne - this.minOne
        let twoNorm = this.maxTwo - this.minTwo

        if (oneNorm == 0) { oneNorm = 1 }
        if (twoNorm == 0) { twoNorm = 1 }

        const normalizedTwo = (two - this.minTwo) / twoNorm
        const normalizedOne = (one - this.minOne) / oneNorm

        return (twoWeight * normalizedTwo) + (oneWeight * normalizedOne)
    }
}

module.exports = sfHelper
