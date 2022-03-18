const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const User = require('./models/user');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
var logger = require('morgan');
const path = require('path');
const { flash } = require('express-flash-message');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config()
const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'mySessions'
});

cloudinary.config({
    cloud_name: 'dqa6xyvq1',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//   const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: "DEV",
//     },
//   });

// const upload = multer({ storage: storage });

require('./db-utils/connect')
const recipeController = require('./controllers/recipeController')
const userController = require('./controllers/userController')
const homeController = require('./controllers/homeController')
app.use(express.static("public"))
app.use(methodOverride('_method'))
app.use(require('./middleware/logger'))
const isLoggedIn = require('./middleware/isLoggedIn')
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1week
    },
}))

// app.use(flash({ sessionKeyName: 'flashMessage', useCookieSession: true }));

app.use(passport.authenticate('session'));

// RYANS SECRET MIDDLEWARE TO HOOK UP PASSPORTS IDEA OF LOGGING IN WITH YOURS
app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        req.session.isLoggedIn = true;
        req.session.userId = req.session.passport.user
        // console.log(req.user)
        // console.log(req.session.passport.user)
    }
    next()
})

app.use(async (req, res, next) => {
    // This will send info from session to templates
    res.locals.isLoggedIn = req.session.isLoggedIn
    if (req.session.isLoggedIn) {
        const currentUser = await User.findById(req.session.userId)
        res.locals.username = currentUser.username
        res.locals.firstName = currentUser.firstName
        res.locals.userId = req.session.userId.toString()
        currentUserId = res.locals.userId
        res.locals.user = currentUser
        // console.log("res.localsssssssss", res.locals.user)
    } else {
        res.locals.username = false
        currentUserId = null
        firstName = null
        lastName = null
    }
    next()
})

app.use(flash({ sessionKeyName: 'flashMessage' }));

app.use('/recipes', recipeController)
app.use('/users', userController)
app.use('/', homeController)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('app running')
})