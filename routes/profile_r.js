const express = require("express")
const router = express.Router()
const query = require("../local_modules/query")

router.get('/id/:profileId', async(req, res) => {
    const profile = await query.getProfile({ name: req.params.profileId })
    if (profile) {
        const reviews = await query.getReviews({ profileId: profile._id })
        const data = {
            sb: { ...profile, reviewCount: reviews.length },
            reviews: reviews.map((r) => {
                r.likeCount = r.likes.length - r.dislikes.length
                return r
            })
        }

        res.render('profile', data)
        console.log(`ROUTE -> profile: ${req.params.profileId}`)
    } else {
        // TODO: Nicer error page?
        res.send('User not found!')
        console.log(`FAILED -> profile: ${req.params.profileId}`)
    }
})

// TODO: UNDER CONTRUCTION
router.get('/edit', (req, res) => {
    res.send("Under construction!")
    // res.render('edit_profile')
    console.log('ROUTE -> EDIT PROFILE (under construction)')
})

module.exports = router
