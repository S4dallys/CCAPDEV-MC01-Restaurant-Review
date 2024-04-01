function checkAuthenticate(req, res, next) {
    if (req.isAuthenticated()) {
        req.app.locals.user = req.user
    } else {
        req.app.locals.user = null
    }

    return next()
}

module.exports = checkAuthenticate
