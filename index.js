// node requires
const path = require("path")
const express = require("express")
const exphbs = require("express-handlebars")
const fileUpload = require("express-fileupload")

// mongoose connect
const mongoose = require("mongoose")
const Profile = require("./database/models/Profile")
const Resto = require("./database/models/Resto")
const Review = require("./database/models/Review")
mongoose.connect("mongodb://localhost/ccapdev");

// express settings
const app = new express()
app.use(express.json()) // use json
app.use(express.urlencoded( {extended: true})); // files consist of more than strings
app.use(express.static('public')) // we'll add a static directory named "public"
app.use(fileUpload()) // for fileuploads

app.engine('handlebars', exphbs.engine({ defaultLayout: 'header' }))
app.set('view engine', 'handlebars')

// homepage get request
app.get('/', async (req, res) => {
    const restos = await getRestos({})

    if (restos) {
        restos.forEach(async (r) => {
            const reviews = await Review.find({ restoId: r._id }, { stars: 1 })
            const reviewCount = reviews.length

            r.reviewCount = reviewCount
            r.stars = reviews.reduce((total, rev) => { return total + rev.stars }, 0) / reviewCount
        })

        res.render('home', { restos: restos })
        console.log(`ROUTE -> index: filter = '${req.query.filter}'`)
    } else {
        res.send('Homepage error! Please refresh.')
        console.log(`FAILED -> index: filter = '${req.query.filter}'`)
    }
})

app.get('/profile/:profileId', async(req, res) => {
    const profile = await getProfile({ name: req.params.profileId })
    if (profile) {
        const reviews = await getReviews({ profileId: profile._id })
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

app.get('/resto/:restoId', async (req, res) => {
    const resto = await getResto({ name: req.params.restoId })
    if (resto) {
        const reviews = await getReviews({ restoId: resto._id })
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
    } else {
        res.send('Restaurant not found!')
        console.log(`FAILED -> profile: ${req.params.restoId}`)
    }
})

// TODO: UNDER CONTRUCTION
app.get('/edit_profile', (req, res) => {
    res.send("Under construction!")
    // res.render('edit_profile')
    console.log('edit_profile.handlebars loaded...')
})

// listen! :3
var server = app.listen(3000, function () {
    console.log('SERVER IS UP!');
});




// functions
// TODO: move elsewhere?
async function getProfile(filter) {
    return await Profile.findOne(filter).lean()
}

async function getResto(filter) {
    return await Resto.findOne(filter).lean()
}

async function getRestos(filter) {
    return await Resto.find(filter).lean()
}

async function getReviews(filter) {
    return await Review.find(filter)
        .populate("restoId")
        .populate("profileId")
        .lean()
}


// TODO: variable html titles
