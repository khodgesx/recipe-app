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
const session = require('express-session');
const path = require('path');
const { flash } = require('express-flash-message');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://feastr.herokuapp.com/oauth2/redirect/google',
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
            req.session.isLoggedIn = true

        } else {
            console.log("found existing user");
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

    try {
        const passUser = await User.findById(id)

        if (passUser) {

            return cb(null, passUser)
        } else {
            return cb(null, false)
        }
    } catch (err) {
        return cb(err, false)
    }

});


router.get('/flash', async function (req, res) {
    // Set a flash message by passing the key, followed by the value, to req.flash().
    await req.flash('info', 'Congratulations, you logged in successfully.');
    res.redirect('/');
});

router.get('/flashloginfail', async function (req, res) {
    // Set a flash message by passing the key, followed by the value, to req.flash().
    await req.flash('loginfail', 'Username and/or password incorrect. Please try again.')
    res.redirect('/login');
});






router.get('/', async (req, res) => {
    // THERE IS A REQ.SESSION.PASSPORT.USER THAT HAS THE OBJECTID IN IT
    try {
        const messages = await req.consumeFlash('info');

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
        console.log(messages)
        res.render('home.ejs', {
            recipes: recipes,
            messages: messages
        })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})


router.get('/login', async (req, res, next) => {
    const messages = await req.consumeFlash('loginfail');
    console.log("hello")
    res.render('login.ejs', {
        messages: messages
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

                res.redirect('/flash')
                return
            } else {
                res.redirect('/flashloginfail')
                return
            }
        } else {
            res.redirect('/flashloginfail')
            // Let them try again?
            return
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