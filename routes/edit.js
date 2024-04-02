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

router.post('/update', upload.single("avatar"), async (req, res) => {
    try {
        const user = req.user
        const name = req.body.name
        const desc = req.body.description
        const avatar = req.file

        if (!user || name === "") {
            res.json({ success: false })
            return
        }

        const found = await query.getProfile({ name: name })
        if (name === user.name || !found) {
            const oldAvatar = user.avatar
            const updateObj = { name: name, description: desc }
            if (avatar) { 
                updateObj.avatar = avatar.filename 
                fs.unlink("./public/imgs/avatars/" + oldAvatar, (err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Deleted old avatar of " + user.name)
                    }
                })
            }

            await query.updateProfile({ _id: user._id }, { $set: updateObj })

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
