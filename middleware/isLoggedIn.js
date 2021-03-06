module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.session.isLoggedIn = true
    }
    if (req.session.isLoggedIn) {
        next()
    } else {
        res.redirect("/login")
    }
}