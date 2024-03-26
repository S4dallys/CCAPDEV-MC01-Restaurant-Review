const express = require('express');
const router = express.Router()
const query = require('../utility/query');
const error = require("../utility/error")
const bcrypt = require("bcrypt")
const passport = require('passport');

router.post('/register', async (req, res) => {
    try {
        const { username, password, confirm_password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        // do error checking
        // ...

        await query.insertProfle({
            name: username,
            password: hashedPassword
        })

        console.log(`REGISTER SUCCESSFUL!\nU: ${username}\nP: ${password}`)
        res.redirect("/")
    } catch (err) {
        // ...
        res.render("error", { message: err.message })
    }
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/error',
    failureFlash: true
}))

router.get('/logout', (req, res) => {
    req.logOut((err) => {
        console.log(err)
    })
    res.redirect('/')
})

module.exports = router
