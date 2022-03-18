const User = require('../models/user')
const Recipe = require('../models/recipe')
const bcrypt = require('bcryptjs');
const express = require('express')
const router = express.Router()
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const logger = require('morgan');
const mongoose = require("mongoose");
const db = mongoose.connection;
const isLoggedIn = require('../middleware/isLoggedIn')


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/oauth2/redirect/google',
    scope: ['profile']
},
    async function (issuer, profile, cb) {
        // Check the database for an existing user 
        let goodUser
        const possibleUser = await User.findOne({ googleID: profile.id })
        if (!possibleUser) {
            console.log("failed to find existig user")
            // Create a user with the given info from profile
            const goodUser = await User.create({ googleID: profile.id, googleDisplayName: profile.displayName, username: `Google:${profile.id}`, firstName: profile.name.givenName, email: "blah", password: "nothanksIgoogle" })
            console.log(goodUser)
        } else {
            console.log("found existing user");
            console.log(possibleUser)
            goodUser = possibleUser
        }
        console.log("hi")
        return cb(null, goodUser)
    })
)

passport.serializeUser(function (user, done) {
    done(null, user.id)
});

passport.deserializeUser(async (id, cb) => {
    console.log('-----------')
    try {
        const passUser = await User.findById(id)
        console.log('-----------')
        if (passUser) {
            console.log(passUser)
            return cb(null, passUser)
        } else {
            return cb(null, false)
        }
    } catch (err) {
        return cb(err, false)
    }

});




router.get('/', async (req, res) => {
    // THERE IS A REQ.SESSION.PASSPORT.USER THAT HAS THE OBJECTID IN IT
    try {
        let recipes = await Recipe.find()
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                let temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }
        const recipesShuffled = shuffleArray(recipes)
        res.render('home.ejs', {
            recipes: recipes
        })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})


router.get('/login', (req, res, next) => {
    console.log("hello")
    res.render('login.ejs', {

    })
})



router.get('/login/google', passport.authenticate('google'))



router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
    session: true
}));




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
                res.redirect('/')
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
    req.logout();
    req.session.destroy(() => {
        res.redirect("/")
    })
})

// router.post('/logout', function (req, res, next) {
//     req.logout();
//     res.redirect('/');
// });






module.exports = router