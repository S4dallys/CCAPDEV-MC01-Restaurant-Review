const query = require('../utility/query')
const bcrypt = require("bcrypt")
const LocalStrategy = require('passport-local').Strategy

function init(passport) {
    const authenticateUser = async (username, password, done) => {
        const user = await query.getProfile({ name: username })

        if (!user) { return done(null, false, { message: "No user found" }) }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: "Password incorrect" })
            }
        } catch (err) {
            // ...
            return done(err)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, authenticateUser))
    passport.serializeUser((user, done) => { done(null, user._id) })
    passport.deserializeUser(async (id, done) => { return done(null, await query.getProfile({ _id: id })) })
}

module.exports = init
