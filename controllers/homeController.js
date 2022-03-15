const User = require('../models/user')
const Recipe = require('../models/recipe')
const bcrypt = require('bcryptjs');
const express = require('express')
const router = express.Router()


// router.get('/signup', (req, res)=>{
//     res.render('auth/signup')
// })

router.get('/', async (req, res) => {
    const recipes = await Recipe.find()
    res.render('home.ejs', {
        recipes: recipes
    })
})

router.get('/login', (req, res) => {
    console.log("hello")
    res.render('login.ejs', {

    })
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
                res.redirect("/login")
            }
        } else {
            // Let them try again?
            res.redirect("/login")
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








module.exports = router