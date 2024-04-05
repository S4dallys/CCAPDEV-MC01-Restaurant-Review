const express = require('express');
const router = express.Router()
const query = require("../utility/query")
const error = require("../utility/error")
const { sortFilterHome } = require("../utility/sfHelper")
const checkAuthenticate = require('../utility/checkauthenticate');

router.get('/', checkAuthenticate, async (req, res) => {
    try {
        const q = req.query

        const sort = q.sort || "relevance"
        const order = q.order || "desc"
        const min = q.min || 0
        const max = q.max || 5
        const filter = q.filter || null

        const regex = filter ? new RegExp(filter, "i") : /./g
        const restos = await query.getRestos({ name: { $regex: regex } });

        if (!restos) {
            error.throwRestoFetchError()
        }

        const sfRestos = await sortFilterHome(restos, min, max, sort, order)

        console.log(`ROUTE -> index`)
        res.render('home', { restos: sfRestos, home: true })
    } catch (err) {
        console.log(`ERROR! ${err.message}`)

        if (err.name !== "RestoFetchError") {
            res.redirect(`/error`)
        } else {
            res.redirect(`/error?errorMsg=${err.message}`)
        }
    }
})

router.get("/error", (req, res) => {
    const err = req.query.errorMsg
    res.render("error", { message: err || "Unknown error. Please retry!" })
})

router.get("/about", (req, res) => {
    res.render("about")
})

module.exports = router
