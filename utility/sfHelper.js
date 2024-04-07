const query = require('../utility/query');
const numPerPage = 10

// Home
// Sort by: relevance/reviews
// Filter by: stars

// Reviews
// Sort by: relevance/likes/lastUpdated
// Filter by: stars / OR

const sfHelper = {
    sortFilterHome: sortFilterHome,
    sortFilterReviews: sortFilterReviews
}

async function sortFilterHome(restos, min, max, sort, order) {
    let [minStars, maxStars, minRevs, maxRevs] = [null, null, null, null]

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
        maxStars = Math.max(maxStars, r.stars)
        minRevs = Math.min(minRevs, r.reviewCount)
        maxRevs = Math.max(maxRevs, r.reviewCount)
    }))

    const relevance = new Relevance(minStars, maxStars, minRevs, maxRevs, 0.8, 0.2)
    let newRestos = restos.filter(r => r.stars >= min && r.stars <= max)

    newRestos.sort((a, b) => {
        if (sort === "relevance") {
            return relevance.getRelevance(b.stars, b.reviewCount) - relevance.getRelevance(a.stars, a.reviewCount)
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

async function sortFilterReviews(reviews, min, max, sort, order, page, or, filter, user) {
    let [minLikes, maxLikes, minlastUpdated, maxlastUpdated] = [null, null, null, null]

    reviews.map((r) => {
        r.likeCount = r.likes.length - r.dislikes.length
        r.erms = r.profileId.erms

        if (user) {
            r.edit = user._id.equals(r.profileId._id)
            if (r.likes.map(l => l.toString()).includes(user._id.toString())) {
                r.state = "like"
            } else if (r.dislikes.map(l => l.toString()).includes(user._id.toString())) {
                r.state = "dislike"
            } else {
                r.state = "none"
            }
        } else {
            r.state = "none"
        }

        // first run
        if (minLikes == null) {
            minLikes = r.erms
            maxLikes = r.erms
            minlastUpdated = r.lastUpdated
            maxlastUpdated = r.lastUpdated
        }

        minLikes = Math.min(minLikes, r.erms)
        maxLikes = Math.max(maxLikes, r.erms)
        minlastUpdated = Math.min(minlastUpdated, r.lastUpdated)
        maxlastUpdated = Math.max(maxlastUpdated, r.lastUpdated)
    })

    const relevance = new Relevance(minLikes, minLikes, minlastUpdated, maxlastUpdated, 0.6, 0.4)
    const regex = filter ? new RegExp(filter, "i") : /./g
    let newReviews = reviews.filter(r =>
        r.stars >= min &&
        r.stars <= max &&
        ((or === "or") ? r.hasOr : true && (regex.test(r.body) || regex.test(r.title))))

    newReviews.sort((a, b) => {
        if (sort === "relevance") {
            return relevance.getRelevance(b.likeCount, b.lastUpdated.getTime()) - relevance.getRelevance(a.likeCount, a.lastUpdated.getTime())
        } else if (sort === "likes") {
            return b.likeCount - a.likeCount
        } else if (sort === "date") {
            return b.lastUpdated.getTime() - a.lastUpdated.getTime()
        }
    })

    const startPage = numPerPage * (page - 1)
    const endPage = startPage + numPerPage

    if (order === "asc") {
        return newReviews.reverse().slice(startPage, endPage)
    } else if (order === "desc") {
        return newReviews.slice(startPage, endPage)
    }
}

function Relevance(minOne, maxOne, minTwo, maxTwo, oneWeight, twoWeight) {
    this.minOne = minOne
    this.maxOne = maxOne
    this.minTwo = minTwo
    this.maxTwo = maxTwo
    this.oneWeight = oneWeight
    this.twoWeight = twoWeight

    this.getRelevance = function(one, two) {
        // home: stars, revs
        // resto: erms, lastUpdated
        let oneNorm = this.maxOne - this.minOne
        let twoNorm = this.maxTwo - this.minTwo

        if (oneNorm == 0) { oneNorm = 0.1 }
        if (twoNorm == 0) { twoNorm = 0.1 }

        const normalizedOne = (one - this.minOne) / oneNorm
        const normalizedTwo = (two - this.minTwo) / twoNorm

        return (this.twoWeight * normalizedTwo) + (this.oneWeight * normalizedOne)
    }
}

module.exports = sfHelper
