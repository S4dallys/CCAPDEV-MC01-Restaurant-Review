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

// express gets
app.get('/', (req, res) => {
    res.render('index')
})

// express posts

// listen!
var server = app.listen(3000, function () {
    console.log('Node server is running..');
});

