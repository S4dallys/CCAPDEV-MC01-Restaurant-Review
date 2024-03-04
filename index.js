// node requires
const express = require("express")
const path = require("path")
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
    console.log('index.handlebars loaded...')
    console.log(`filter: ${req.query.filter}`)
})

app.get('/profile', (req, res) => {
    res.render('profile')
    console.log('profile.handlebars loaded...')
})

app.get('/review', (req, res) => {
    res.render('review')
    console.log('review.handlebars loaded...')
})

app.get('/edit_profile', (req, res) => {
    res.render('edit_profile')
    console.log('edit_profile.handlebars loaded...')
})




// listen!
var server = app.listen(3000, function () {
    console.log('Node server is running..');
});

