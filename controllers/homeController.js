const express = require('express')
const router = express.Router()


// router.get('/signup', (req, res)=>{
//     res.render('auth/signup')
// })


router.get('/login', (req, res) => {
    console.log("hello")
    res.render('../login.ejs')
})

router.post("/login", async (req, res) => {
    try {
        // Grab the user from the database with the username from the form
        const possibleUser = await User.findOne({ username: req.body.username })
        if (possibleUser) {
            // There is a user with this username!
            // Compare the password from the form with the database password
            if (bcrypt.compareSync(req.body.password, possibleUser.password)) {
                // It's a match! Successful login!
                req.session.isLoggedIn = true;
                req.session.userId = possibleUser._id;
                res.redirect("/users")
            } else {
                res.redirect("/users/login")
            }
        } else {
            // Let them try again?
            res.redirect("/users/login")
        }
    } catch (err) {
        console.log(err);
        res.send(500)
    }
})
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
})
router.get('/', async (req, res) => {
    const users = await User.find({ username: req.query.username });
    res.render('users/index.ejs', {
        users: users
    })
})







module.exports = router