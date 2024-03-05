// node requires
const express = require("express")
const fileUpload = require("express-fileupload")
const exphbs = require("express-handlebars")

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

app.get('/profile/:userId', (req, res) => {
    res.render('profile')
    console.log(`ROUTE -> profile: ${req.params.userId}`)
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
