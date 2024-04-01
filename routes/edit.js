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

router.get('/update', checkAuthenticate, async (req, res) => {
    try {
        const user = req.user
        const name = req.query.username
        const desc = req.query.description

        console.log("desc", req.query)

        if (!user || name === "") {
            res.json({ success: false })
            return
        }

        const found = await query.getProfile({ name: name })
        if (name === user.name || !found) {
            await query.updateProfile({ _id: user._id }, { $set: { name: name, description: desc } })

            console.log(`ROUTE -> UPDATED PROFILE (${user.name})`)
            res.json({ success: true })
        } else {
            console.log(`ROUTE -> FAILED TO UPDATE PROFILE`)
            res.json({ success: false })
        }
    } catch (err) {
        console.log(`ERROR! ${err.message}`)
        res.json({ success: false })
    }
})

module.exports = router
