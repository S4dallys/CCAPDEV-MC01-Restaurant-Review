const express = require("express")
const router = express.Router()
const multer = require("multer")
const query = require("../local_modules/query")
const error = require("../local_modules/error")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imgs/uploads')
  },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const maxuploads = 4
const upload = multer({ storage: storage })

router.post("/:restoId/new", upload.array("rv-images", maxuploads), async(req, res) => {
    try {
        const restoId = req.params.restoId
        const [profile, resto] = await Promise.all([
            query.getProfile({ name: "anonymous" }),
            query.getResto({ name: restoId })
        ])

        if (!profile) {
            error.throwLoginError()
        }

        if (!resto) {
            error.throwRestoError()
        }

        const data = {
            restoId: resto._id,
            profileId: profile._id,
            title: req.body["rv-title"],
            body: req.body["rv-body"],
            uploads: req.files.map((i) => {
                return i.filename
            }),
            lastUpdated: new Date(),
            stars: req.body["rv-stars"],
        }

        const newReview = await query.insertReview(data)

        res.redirect(`/resto/id/${restoId}`)

        console.log(`POST -> ${ resto.name } - ${ req.body["rv-title"] }`)
        console.log(`\n--- UPLOAD ---\n${newReview}\n--------------\n`)
    } catch (err) {
        if (err.name === "LoginError" || err.name === "RestoError") {
            console.log(`ERROR! ${err.message}`)
        } else if (err.name === "ValidationError") {
            console.log(`ERROR! ${err.message}`)
            err = error.getInsertError()
        } else {
            console.log(`ERROR! ${err.message}`)
            err = error.getUnknownError()
        }

        res.render("error", { message: err.message })
    }
})

module.exports = router
