const express = require("express")
const router = express.Router()
const query = require("../utility/query")
const { sortFilterReviews } = require("../utility/sfHelper")
const error = require("../utility/error")
const checkAuthenticate = require("../utility/checkauthenticate")

router.get('/id/:profileId', checkAuthenticate, async(req, res) => {
    try {
        const q = req.query

        const sort = q.sort || "relevance"
        const order = q.order || "desc"
        const min = q.min || 0
        const max = q.max || 5
        const page = q.page || 1

        const profile = await query.getProfile({ name: req.params.profileId })

        if (!profile) {
            error.throwProfileError()
        }

        const reviews = await query.getReviews({ profileId: profile._id })

        if (!reviews) {
            error.throwReviewFetchError()
        }

        const sb = { ...profile, reviewCount: reviews.length } 

        const sfReviews = await sortFilterReviews(reviews, min, max, sort, order, page)

        console.log(`ROUTE -> profile: ${req.params.profileId}`)
        res.render('profile', { sb: sb, reviews: sfReviews })
    } catch (err) {
        console.log(`ERROR! ${err.message}`)

        if (err.name !== "ProfileError" && err.name !== "ReviewFetchError") {
            res.redirect(`/error`)
        } else {
            res.redirect(`/error?errorMsg=${err.message}`)
        }
    }
})


module.exports = router
