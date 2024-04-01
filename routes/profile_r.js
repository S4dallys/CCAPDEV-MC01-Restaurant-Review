const express = require("express")
const router = express.Router()
const query = require("../utility/query")
const error = require("../utility/error")
const checkAuthenticate = require("../utility/checkauthenticate")

router.get('/id/:profileId', checkAuthenticate, async(req, res) => {
    try {
        const profile = await query.getProfile({ name: req.params.profileId })

        if (!profile) {
            error.throwProfileError()
        }

        const reviews = await query.getReviews({ profileId: profile._id })

        if (!reviews) {
            error.throwReviewFetchError()
        }

        const data = {
            sb: { ...profile, reviewCount: reviews.length },
            reviews: reviews.map((r) => {
                r.likeCount = r.likes.length - r.dislikes.length
                return r
            }),
            isCurrentUser: req.isAuthenticated() && (req.user.name == profile.name)
        }

        console.log(`ROUTE -> profile: ${req.params.profileId}`)
        res.render('profile', data)
    } catch (err) {
        console.log(`ERROR! ${err.message}`)

        if (err.name !== "ProfileError" && err.name !== "ReviewFetchError") {
            res.redirect(`/error`)
        } else {
            res.redirect(`/error?errorMsg=${err.message}`)
        }
    }
})

// TODO: UNDER CONTRUCTION
router.get('/edit', checkAuthenticate, (req, res) => {
    const user = req.user

    if (!user) {
        res.redirect("/error?errorMsg=Login details could not be found.")
        return
    }

    console.log(`ROUTE -> EDIT PROFILE (${user.name})`)
    res.render("edit", user)
})

module.exports = router
