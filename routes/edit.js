const express = require("express")
const router = express.Router()
const query = require("../utility/query")
const error = require("../utility/error")
const checkAuthenticate = require("../utility/checkauthenticate")

// TODO: UNDER CONTRUCTION
router.get('/', checkAuthenticate, (req, res) => {
    const user = req.user

    if (!user) {
        res.redirect("/error?errorMsg=Login details could not be found.")
        return
    }

    console.log(`ROUTE -> EDIT PROFILE (${user.name})`)
    res.render("edit", user)
})

router.post('/', checkAuthenticate, (req, res) => {
    const user = req.user

    if (!user) {
        res.redirect('/error?errorMsg=Login details not found.')
        return
    }

    // TODO: do validation

    if (true) {
        console.log(`ROUTE -> UPDATED PROFILE (${user.name})`)
        res.json({ success: true })
    } else {
        console.log(`ROUTE -> FAILED TO UPDATE PROFILE`)
        res.json({ success: false })
    }
})

module.exports = router
