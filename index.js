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
app.use(express.urlencoded({ extended: true })); // files consist of more than strings
app.use(express.static('public')) // we'll add a static directory named "public"

// global data
app.locals.currentUser = null

// hbs
hbs.registerPartials(__dirname + "/views/partials")
app.set('views', __dirname + "/views")
app.set('view engine', 'hbs')
app.set('view options', { layout: '/layouts/header' });

const session = require("express-session")
const MongoStore = require('connect-mongo')(session);
const passport = require('passport')
const initPassport = require("./utility/passport_config")

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new MongoStore(options),
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: false 
    }
}))

app.use(passport.session())
initPassport(passport)

// routes
const homeRouter = require("./routes/home")
const profileRouter = require("./routes/profile")
const restoRouter = require("./routes/resto")
const reviewRouter = require("./routes/review")
const authRouter = require("./routes/auth")
const editRouter = require("./routes/edit")

app.use("/", homeRouter)
app.use("/profile", profileRouter)
app.use("/resto", restoRouter)
app.use("/review", reviewRouter)
app.use("/auth", authRouter)
app.use("/edit", editRouter)


// listen! :3
const server = app.listen(3000, function() {
    console.log('SERVER IS UP!');
});
