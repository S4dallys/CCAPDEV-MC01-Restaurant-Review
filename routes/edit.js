const express = require("express")
const router = express.Router()
const query = require("../utility/query")
const error = require("../utility/error")
const multer = require("multer")
const fs = require("fs")
const checkAuthenticate = require("../utility/checkauthenticate")

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/imgs/avatars')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

router.get('/user', checkAuthenticate, (req, res) => {
    if (!req.isAuthenticated()) {
        res.redirect("/error?errorMsg=Login details could not be found.")
        return
    }

    console.log(`ROUTE -> EDIT PROFILE (${req.user.name})`)
    res.render("edit-profile", req.user)
})

router.get("/review/:revId", checkAuthenticate, async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            error.throwLoginError()
        }

        const review = await query.getReview({ _id: req.params.revId })

        if (!review) {
            error.throwReviewFetchError()
        }

        console.log(`ROUTE -> EDIT REVIEW (${review.title})`)
        console.log(review)
        res.render("edit-review", review)
    } catch (err) {
        console.log(`ERROR! ${err.message}`)

        if (err.name != "ReviewFetchError") {
            res.redirect(`/error`)
        } else {
            res.redirect(`/error?errorMsg=${err.message}`)
        }
    }
})

router.post('/update', upload.single("avatar"), async (req, res) => {
    try {
        const user = req.user
        const name = req.body.name
        const desc = req.body.description
        const avatar = req.file

        if (!user || name === "") {
            res.status(400).send("Bad Data.")
            return
        }

        const found = await query.getProfile({ name: name })
        if (name === user.name || !found) {
            const oldAvatar = user.avatar
            const updateObj = { name: name, description: desc }
            if (avatar) {
                updateObj.avatar = avatar.filename

                if (oldAvatar !== "default_avatar.png") {
                    fs.unlink("./public/imgs/avatars/" + oldAvatar, (err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("Deleted old avatar of " + user.name)
                        }
                    })
                } else {
                    console.log("Switched old avatar of " + user.name)
                }
            }

            await query.updateProfile({ _id: user._id }, { $set: updateObj })

            console.log(`ROUTE -> UPDATED PROFILE (${user.name})`)
            res.status(200).send("Success!")
        } else {
            console.log(`ROUTE -> FAILED TO UPDATE PROFILE`)
            res.status(409).send("Bad Credentials.")
        }
    } catch (err) {
        console.log(`ERROR! ${err.message}`)
        res.status(401).send("Failed to update.")
    }
})

module.exports = router
