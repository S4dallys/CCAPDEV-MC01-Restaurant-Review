if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// node requires
const path = require("path")
const express = require("express")
const hbs = require("hbs")
const query = require("./utility/query")
const error = require("./utility/error")

// express settings
const app = new express()
app.use(express.json()) // use json
app.use(express.urlencoded( {extended: true})); // files consist of more than strings
app.use(express.static('public')) // we'll add a static directory named "public"

hbs.registerPartials(__dirname + "/views/partials")
app.set('views', __dirname + "/views")
app.set('view engine', 'hbs')
app.set('view options', { layout: '/layouts/header' });

const session = require("express-session")
const passport = require('passport')
const initPassport = require("./utility/passport_config")
const checkAuthenticate = require("./utility/checkauthenticate")

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
initPassport(passport)

// routes
const profileRouter = require("./routes/profile_r")
const restoRouter = require("./routes/resto_r")
const reviewRouter = require("./routes/review_r")
const authRouter = require("./routes/auth")
const editRouter = require("./routes/edit")

app.use("/profile", profileRouter)
app.use("/resto", restoRouter)
app.use("/review", reviewRouter)
app.use("/auth", authRouter)
app.use("/edit", authRouter)

// global data
app.locals.user = null

// homepage get request
app.get('/', checkAuthenticate, async (req, res) => {
    try {
        const filter = req.query.filter
        const filterObj = (filter) ? 
            { name: { $regex: filter, $options: 'i' } } 
            : {} 

        const restos = await query.getRestos(filterObj);

        if (!restos) {
            error.throwRestoFetchError()
        }

        await Promise.all(restos.map(async (r) => {
            const reviews = await query.getReviews({ restoId: r._id });
            const reviewCount = reviews.length;
            r.reviewCount = reviewCount;
            r.stars = reviewCount > 0 ? reviews.reduce((total, rev) => total + rev.stars, 0) / reviewCount : 0;
        }));

        console.log(`ROUTE -> index: filter = '${filter}'`)
        res.render('home', { restos: restos, home: true })
    } catch (err) {
        console.log(`ERROR! ${err.message}`)

        if (err.name !== "RestoFetchError") {
            res.redirect(`/error`)
        } else {
            res.redirect(`/error?errorMsg=${err.message}`)
        }
    }
})

app.get("/error", (req, res) => {
    const err = req.query.errorMsg
    res.render("error", { message: err || "Unknown error. Please retry!" })
})

// listen! :3
var server = app.listen(3000, function () {
    console.log('SERVER IS UP!');
});
