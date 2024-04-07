const express = require('express');
const router = express.Router()
const query = require('../utility/query');
const error = require("../utility/error")
const bcrypt = require("bcrypt")
const passport = require('passport');
const checkAuthenticate = require('../utility/checkauthenticate');

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
        res.redirect(`/error?errorMsg=${err.message}`)
    }
})

router.post('/login', passport.authenticate('local'), (req, res) => {
    if (req.isAuthenticated()) {
        if (req.body.rememberMe) {
            req.session.cookie.maxAge = 1814400000
        }
        res.redirect('/')
    } else {
        res.redirect("/error?=Failed to log in, please try again!")
    }
})

router.post('/validatecredentials', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const user = await query.getProfile({ name: username })

    if (!user) {
        res.status(400).send("Bad Credentials")
        return
    }

    try {
        if (await bcrypt.compare(password, user.password)) {
            res.status(200).send("Success!")
        } else {
            res.status(400).send("Bad Credentials")
        }
    } catch (err) {
        res.status(500).send("Internal Error")
    }
})

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            res.redirect('/error?errorMsg=Failed to logout.')
        } else {
            res.clearCookie("restaurantReviewsCookie").redirect('/')
        }
    })
})

router.post('/nametaken', async (req, res) => {
    const results = await query.getProfile({ name: req.body.username })

    if (results) {
        res.status(409).send("Username Taken.")
    } else {
        res.status(200).send("Success!")
    }
})

router.get('/authorized', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).send("User is authenticated.")
    } else {
        res.status(206).send("User is not authenticated.")
    }
})

module.exports = router
