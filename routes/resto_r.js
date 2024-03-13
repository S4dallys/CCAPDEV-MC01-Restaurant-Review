const express = require("express")
const router = express.Router()
const query = require("../local_modules/query")

router.get('/id/:restoId', async(req, res) => {
    const resto = await query.getResto({ name: req.params.restoId })
    if (resto) {
        const reviews = await query.getReviews({ restoId: resto._id })
        const reviewCount = reviews.length
        const stars = (reviews.reduce((total, rev) => { return total + rev.stars }, 0) / reviewCount).toFixed(2)
        const data = { 
            sb: {
                ...resto, 
                reviewCount: reviewCount,
                stars: (isNaN(stars)) ? 0 : stars
            },
            reviews: reviews.map((r) => {
                r.likeCount = r.likes.length - r.dislikes.length
                return r
            })
        }

        res.render('resto', data)
        console.log(`ROUTE -> resto: ${req.params.restoId}`)

        req.restoId = req.params.restoId
    } else {
        res.send('Restaurant not found!')
        console.log(`FAILED -> profile: ${req.params.restoId}`)
    }
})

module.exports = router
