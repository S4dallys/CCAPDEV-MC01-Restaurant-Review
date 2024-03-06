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
app.get('/', (req, res) => {
    res.render('index')
    console.log(`ROUTE -> index: filter = '${req.query.filter}'`)
})

app.get('/profile/:profileId', async(req, res) => {
    const profile = await getProfile({ name: req.params.profileId })
    const reviews = await getReviews({ profileId: profile._id })

    const data = {
        sb: {
            ...profile,
            reviewCount: reviews.length
        },
        reviews: reviews.map((r) => {
            r.likeCount = r.likes.length - r.dislikes.length
            return r
        })
    }

    console.log(data.reviews[0].restoId.name)

    res.render('profile', data)

    console.log(`ROUTE -> profile: ${req.params.profileId}`)
})

app.get('/resto/:restoId', (req, res) => {
    res.render('resto')
    console.log(`ROUTE -> resto: ${req.params.restoId}`)
})

app.get('/edit_profile', (req, res) => {
    res.render('edit_profile')
    console.log('edit_profile.handlebars loaded...')
})

// listen! :3
var server = app.listen(3000, function () {
    console.log('SERVER IS UP!');
});




// functions
// TODO: move elsewhere?
async function getProfile(filter, select = {}) {
    return await Profile.findOne(filter, select).lean()
}

async function getReviews(filter) {
    return await Review.find(filter)
        .populate("restoId")
        .populate("profileId")
        .lean()
}

