const express = require("express")
const router = express.Router()
const query = require("../utility/query")
const error = require("../utility/error")
const multer = require("multer")
const fs = require("fs")
const checkAuthenticate = require("../utility/checkauthenticate")
const { updateOne } = require("../database/models/Profile")

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/imgs/avatars')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const storage2 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/imgs/uploads')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const av = multer({ storage: storage })
const up = multer({ storage: storage2 })

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

        review.oldImages = review.uploads.length

        console.log(`ROUTE -> EDIT REVIEW (${review.title})`)
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

router.post('/profile', av.single("avatar"), async (req, res) => {
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

router.post('/review', up.array("images", 4), async (req, res) => {
    try {
        const user = req.user
        const { title, content, stars, id, imagesChanged } = req.body
        const images = req.files

        if (!user || title === "") {
            res.status(400).send("Bad Data.")
            return
        }

        const review = await query.getReview({ _id: id })

        if (!review) {
            res.status(400).send("Bad data.")
        }

        if (review.profileId._id.equals(user._id)) {
            const oldImages = review.uploads
            const updateObj = { title: title, body: content, stars: stars }
            if (imagesChanged === "true") {
                updateObj.uploads = images.map(i => { return i.filename })

                oldImages.forEach(img => {
                    fs.unlink("./public/imgs/uploads/" + img, (err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("Deleted old image of " + id)
                        }
                    })
                })
            }

            if (imagesChanged || updateObj.title !== review.title || updateObj.body !== review.body || updateObj.stars !== review.stars.toString()) {
                updateObj.edited = true
                updateObj.lastUpdated = new Date()

                console.log(`ROUTE -> UPDATED REVIEW (${id})`)
                await query.updateReview({ _id: id }, { $set: updateObj })
            } else {
                console.log(`ROUTE -> NO CHANGES TO REVIEW (${id})`)
            }

            res.status(200).send("Success!")
        } else {
            console.log(`ROUTE -> FAILED TO UPDATE REVIEW`)
            res.status(409).send("Bad Credentials.")
        }
    } catch (err) {
        console.log(`ERROR! ${err.message}`)
        res.status(401).send("Failed to update.")
    }
})

router.post("/delete", async (req, res) => {
    try {
        const id = req.body.id
        const review = await query.getReview({ _id: id })

        if (!review) {
            error.throwReviewFetchError()
        }

        if (!req.isAuthenticated() || !req.user._id.equals(review.profileId._id)) {
            error.throwLoginFailError()
        }

        const oldImages = review.uploads

        await query.deleteReview(id)

        oldImages.forEach(img => {
            fs.unlink("./public/imgs/uploads/" + img, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Deleted old image of " + id)
                }
            })
        })

        console.log("DELETED: " + review.title)
        res.redirect(`/resto/id/${review.restoId.name}`)
    } catch (err) {
        console.log(`ERROR! ${err.message}`)

        if (err.name != "ReviewFetchError" && err.name != "LoginFailError") {
            res.redirect(`/error`)
        } else {
            res.redirect(`/error?errorMsg=${err.message}`)
        }
    }
})

router.post("/delete/or", async (req, res) => {
    try {
        const id = req.body.id
        const review = await query.getReview({ _id: id })

        if (!review) {
            error.throwReviewFetchError()
        }

        if (!req.isAuthenticated() || !req.user._id.equals(review.restoId.owner)) {
            error.throwLoginFailError()
        }

        await query.updateReview({ _id: id }, { $set: { ownersResponse: null, hasOr: false } })

        console.log("DELETED OR: " + review.title)
        res.redirect(`/resto/id/${review.restoId.name}`)
    } catch (err) {
        console.log(`ERROR! ${err.message}`)

        if (err.name != "ReviewFetchError" && err.name != "LoginFailError") {
            res.redirect(`/error`)
        } else {
            res.redirect(`/error?errorMsg=${err.message}`)
        }
    }
})

module.exports = router
