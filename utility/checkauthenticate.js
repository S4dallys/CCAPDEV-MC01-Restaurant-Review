function checkAuthenticate(req, res, next) {
    if (req.isAuthenticated()) {
        req.app.locals.currentUser = req.user
    } else {
        req.app.locals.currentUser = null
    }

    return next()
}

module.exports = checkAuthenticate
