const express = require("express")
const router = express.Router()
const query = require("../utility/query")
const error = require("../utility/error")
const checkAuthenticate = require("../utility/checkauthenticate")

router.get('/id/:restoId', checkAuthenticate, async(req, res) => {
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
                r.erms = r.profileId.totalErms
                return r
            }),
            home: false
        }

        console.log(`ROUTE -> resto: ${req.params.restoId}`)
        res.render('resto', data)
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
