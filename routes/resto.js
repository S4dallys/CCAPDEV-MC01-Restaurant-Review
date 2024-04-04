const express = require("express")
const router = express.Router()
const query = require("../utility/query")
const { sortFilterReviews } = require("../utility/sfHelper")
const error = require("../utility/error")
const checkAuthenticate = require("../utility/checkauthenticate")

router.get('/id/:restoId', checkAuthenticate, async (req, res) => {
    try {
        const q = req.query

        const sort = q.sort || "relevance"
        const order = q.order || "desc"
        const min = q.min || 0
        const max = q.max || 5
        const page = q.page || 1
        const or = q.or || "noor"

        const resto = await query.getResto({ name: req.params.restoId })

        if (!resto) {
            error.throwRestoError()
        }

        const reviews = await query.getReviews({ restoId: resto._id })
        const reviewCount = reviews.length

        if (!reviews) {
            error.throwReviewFetchError()
        }

        const sb = {
            ...resto, reviewCount: reviews.length,
            stars: (reviewCount > 0) ? (reviews.reduce((total, rev) => { return total + rev.stars }, 0) / reviewCount).toFixed(2) : 0
        }

        const sfReviews = await sortFilterReviews(reviews, min, max, sort, order, page, or, req.user)

        console.log(`ROUTE -> resto: ${req.params.restoId}`)
        res.render('resto', { sb: sb, reviews: sfReviews  })
    } catch (err) {
        console.log(`ERROR! ${err.message}`)

        if (err.name !== "RestoError" && err.name != "ReviewFetchError") {
            res.redirect(`/error`)
        } else {
            res.redirect(`/error?errorMsg=${err.message}`)
        }
    }
})

module.exports = router
