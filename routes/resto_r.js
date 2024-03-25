const express = require("express")
const router = express.Router()
const query = require("../utility/query")
const error = require("../utility/error")

router.get('/id/:restoId', async(req, res) => {
    try {
        const resto = await query.getResto({ name: req.params.restoId })

        if (!resto) {
            error.throwRestoError()
        }

        const reviews = await query.getReviews({ restoId: resto._id })

        if (!reviews) {
            error.throwReviewFetchError()
        }

        const reviewCount = reviews.length
        const stars = (reviewCount > 0) 
            ? (reviews.reduce((total, rev) => { return total + rev.stars }, 0) / reviewCount).toFixed(2)
            : 0

        const data = { 
            sb: {
                ...resto, 
                reviewCount: reviewCount,
                stars: stars
            },
            reviews: reviews.map((r) => {
                r.likeCount = r.likes.length - r.dislikes.length
                return r
            })
        }

        console.log(`ROUTE -> resto: ${req.params.restoId}`)
        res.render('resto', data)
    } catch (err) {
        if (err.name === "RestoError" || err.name === "ReviewFetchError") {
            console.log(`ERROR! ${err.message}`)
        } else {
            console.log(`ERROR! ${err.message}`)
            err = error.getUnknownError()
        }

        res.render("error", { message: err.message })
    }
})

module.exports = router
