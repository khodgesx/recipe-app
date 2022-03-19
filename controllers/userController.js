const User = require("../models/user")
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Recipe = require("../models/recipe");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require('cloudinary');
const isLoggedIn = require('../middleware/isLoggedIn')
const { flash } = require('express-flash-message');

// Set remote cloudinary folder destination
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "Pics",
//     },
// });
// const upload = multer({ storage: storage });
const upload = multer({ dest: "./uploads/" })

//flash message for duplicate username
router.get('/flashusername', async function (req, res) {
    // Set a flash message by passing the key, followed by the value, to req.flash().
    await req.flash('duplicateusername', 'Oops, that username is taken! Try again.');
    res.redirect('/users/new');
});

// INDEX: GET
// Gives a page displaying all the users
router.get('/', async (req, res) => {
    const users = await User.find();
    if (res.locals.isLoggedIn) {
        res.render('users/index.ejs', {
            users: users
        })
    } else {
        res.redirect('/login')
    }
})
// NEW: GET
// Shows a form to create a new user
router.get('/new', async (req, res) => {
    const messages = await req.consumeFlash('duplicateusername');
    res.render('users/new-user.ejs', {
        messages: messages
    })
})
// SHOW: GET
// Shows users profile page
router.get('/:id', [isLoggedIn], async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const currentUserId = req.session.userId
        const currentUserIdString = req.session.userId.toString()
        const recipesMadeArray = await Recipe.find({ user: req.params.id }).populate('user')
        userWithSavedRecipes = await user.populate('recipesSaved')
        const recipesSavedArray = userWithSavedRecipes.recipesSaved
        res.render('users/show.ejs', {
            recipesSavedArray: recipesSavedArray,
            recipesMadeArray: recipesMadeArray,
            currentUserIdString: currentUserIdString,
            user: user,
            currentUserId: currentUserId
        })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})
// SHOW: GET
// Shows a page displaying all the recipes saved by the user
router.get('/:id/saved', async (req, res) => {
    const currentUser = await User.findById(req.params.id)
    userWithSavedRecipes = await currentUser.populate('recipesSaved')
    const recipes = userWithSavedRecipes.recipesSaved
    res.render("users/index-saved.ejs", {
        currentUser: currentUser,
        recipes: recipes
    })
})
//CREATE: POST create new user with image upload
router.post('/', upload.single('img'), async (req, res) => {
    const userData = req.body
    await cloudinary.uploader.upload(req.file.path, res => {
    })
    const ourUser = await User.findOne({ username: req.body.username })
    if (ourUser) {
        res.redirect('/users/flashusername')
    } else {
        await User.create({
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
            email: userData.email,
            img: res.url
        })
        res.redirect('/login')
    }
})
// EDIT: GET
// SHOW THE FORM TO EDIT A USER 
router.get('/:id/edit', async (req, res) => {
    try {
        if (req.session.userId == req.params.id) {
            const user = await User.findById(req.params.id)
            res.render('users/edit-user.ejs', {
                user: user
            })
        } else {
            throw new Error("Unfortunately, you won't be able to edit other peoples profiles!")
        }
    } catch (err) {
        res.sendStatus(500)
    }
})
// EDIT: GET
// SHOW THE FORM TO EDIT USER PASSWORD
router.get('/:id/editpassword', async (req, res) => {
    try {
        if (req.session.userId == req.params.id) {
            const user = await User.findById(req.params.id)
            res.render('users/edit-password.ejs', {
                user: user
            })
        } else {
            throw new Error("Unfortunately, you won't be able to edit someone else's password!")
        }
    } catch (err) {
        res.sendStatus(500)
    }
})
//EDIT: GET
//get the form to update the user photo:
router.get('/:id/updatephoto', async (req, res) => {
    try {
        if (req.session.userId == req.params.id) {
            const user = await User.findById(req.params.id)
            res.render('users/update-photo.ejs', {
                user: user
            })
        } else {
            throw new Error("Unfortunately, you won't be able to edit someone else's photo!")
        }
    } catch (err) {
        res.sendStatus(500)
    }
})
//UPDATE PUT: update user with :id everything except password or photo
router.put('/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        })
        res.redirect(`/users/${req.params.id}`)
    } catch (err) {
        console.log(err)
    }
})
// UPDATE THE USER'S PASSWORD WITH THE SPECIFIC ID
router.put('/:id/editpassword', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.session.userId, {
            password: bcrypt.hashSync(req.body.password, 10),
        })
        res.redirect(`/users/${req.params.id}`)
    } catch (err) {
        res.send('did not update password')
    }
})
//UPDATE USER PHOTO : /users/:id/updatephoto
router.put('/:id/updatephoto', upload.single("img"), async (req, res) => {
    try {
        const resImgObj = await cloudinary.uploader.upload(req.file.path, resImgObj => {
        })
        await User.findByIdAndUpdate(req.params.id, {
            img: resImgObj.url
        })
        res.redirect(`/users/${req.params.id}`)
    } catch (err) {
        res.send('aslkjdlasdkfj')
        console.log(err)
    }
})
// SHOW: GET
// Shows a page displaying all the recipes created by the user
router.get('/:id/created', async (req, res) => {
    try {
        const recipesWithUserProp = await Recipe.find({ user: req.params.id }).populate('user')
        res.render("users/index-created.ejs", {
            recipesWithUserProp: recipesWithUserProp,
        })
    } catch (err) {
        res.send(err)
    }
})
// DELETE: DELETE
// DELETE THE USER WITH THE SPECIFIC ID
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        req.session.isLoggedIn = false;
        req.logout();
        req.session.destroy(() => {
            res.redirect("/")
        })
    } catch (err) {
        res.sendStatus(500)
    }
})

module.exports = router