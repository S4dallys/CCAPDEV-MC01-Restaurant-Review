const express = require("express")
const router = express.Router()
const multer = require("multer")
const query = require("../local_modules/query")

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
    const restoId = req.params.restoId
    const profile = await query.getProfile({ name: "anonymous" })
    const resto = await query.getResto({ name: restoId })

    const data = {
        restoId: resto._id,
        profileId: profile._id,
        title: req.body["rv-title"],
        body: req.body["rv-body"],
        images: req.files.map((i) => {
            return i.filename
        }),
        lastUpdated: new Date(),
        stars: req.body["rv-stars"],
    }

    query.insertReview(data)
    res.redirect(`/resto/id/${restoId}`)

    console.log(`POST -> ${ resto.name } - ${ req.body["rv-title"] }`)
})

module.exports = router
