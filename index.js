// TODO: variable html titles
// node requires
const path = require("path")
const express = require("express")
const exphbs = require("express-handlebars")
const query = require("./local_modules/query")

// express settings
const app = new express()
app.use(express.json()) // use json
app.use(express.urlencoded( {extended: true})); // files consist of more than strings
app.use(express.static('public')) // we'll add a static directory named "public"

app.engine('hbs', exphbs.engine({ defaultLayout: 'header.hbs' }))
app.set('view engine', 'hbs')

// routes
const profileRouter = require("./routes/profile_r")
const restoRouter = require("./routes/resto_r")
const reviewRouter = require("./routes/review_r")

app.use("/profile", profileRouter)
app.use("/resto", restoRouter)
app.use("/review", reviewRouter)

// homepage get request
app.get('/', async (req, res) => {
    const filter = req.query.filter
    const filterObj = (filter) ? { name: { $regex: filter, $options: 'i' } } : {} 
    const restos = await query.getRestos(filterObj);

    if (restos) {
        await Promise.all(restos.map(async (r) => {
            const reviews = await query.getReviews({ restoId: r._id });
            const reviewCount = reviews.length;
            r.reviewCount = reviewCount;
            r.stars = reviewCount > 0 ? reviews.reduce((total, rev) => total + rev.stars, 0) / reviewCount : 0;
        }));
        res.render('home', { restos: restos })
        console.log(`ROUTE -> index: filter = '${filter}'`)
    } else {
        res.send('Homepage error! Please refresh.')
        console.log(`FAILED -> index: filter = '${filter}'`)
    }
})

// listen! :3
var server = app.listen(3000, function () {
    console.log('SERVER IS UP!');
});
