const User = require("../models/user")
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Recipe = require("../models/recipe");




//test

// INDEX: GET
// /users
// Gives a page displaying all the users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.render('users/index.ejs', {
        users: users
    })
})


// NEW: GET
// /users/new
// Shows a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new-user.ejs')
})



// SHOW: GET
// /users/:id/created
// Shows a page displaying all the recipes created by the user
router.get('/:id/created', async (req, res) => {
    const user = await User.findById(req.params.id)
    // const recipes = await Recipe.find()

    const recipesWithUserProp = await Recipe.find({ user: req.params.id }).populate('user')
    console.log(recipesWithUserProp)
    // const recipeUserId = recipesWithUserProp.user._id
    // const recipesCreatedByUser = await Recipe.findById(recipes._id).populate('user')
    // console.log(recipesCreatedByUser)
    // const recipeCreator = recipesCreatedByUser.user.username
    // const currentUser = await User.findById(req.session.userId)
    res.render("users/index-created.ejs", {
        // user: user,
        recipesWithUserProp: recipesWithUserProp,
        // recipeCreator: recipeCreator,
        // currentUser: currentUser

    })
})

// SHOW: GET
// /users/:id
// Shows users profile page
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    const currentUserId = res.locals.userId
    res.render("users/show.ejs", {
        user: user,
        currentUserId: currentUserId
    })
})



// SHOW: GET
// /users/:id/saved
// Shows a page displaying all the recipes saved by the user
router.get('/:id/saved', async (req, res) => {
    // const user = await User.findById(req.params.id)
    // const recipes = await Recipe.findById
    // const currentUser = req.session.id
    // const recipeWithUserProp = await Recipe.findById(req.params.id).populate('user')
    // const recipeCreator = recipeWithUserProp.user.username
    // console.log(usersSavedRecipes)
    // user.recipesSaved = user.recipesSaved.populate('Recipe')

    const currentUser = await User.findById(req.params.id)
    userWithSavedRecipes = await currentUser.populate('recipesSaved')
    const recipes = userWithSavedRecipes.recipesSaved
    res.render("users/index-saved.ejs", {
        // user: user,
        // currentUser: currentUser,
        recipes: recipes
    })
})



// CREATE: POST
// /users
// Creates an actual user, then...?
router.post('/', async (req, res) => {
    // req.body.password needs to be HASHED
    console.log(req.body)
    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    console.log(hashedPassword)
    req.body.password = hashedPassword
    const newUser = await User.create(req.body);
    console.log(newUser)
    res.redirect('/login')
})

// EDIT: GET
// /users/:id/edit
// SHOW THE FORM TO EDIT A USER
router.get('/:id/edit', async (req, res) => {
    try {
        if (req.session.userId === req.params.id) {
            const user = await User.findById(req.params.id)
            res.render('users/edit.ejs', {
                user: user
            })
        } else {
            throw new Error("Unfortunately, you won't be able to edit other peoples profiles!")
        }
    } catch (err) {
        res.sendStatus(500)
    }
})

// UPDATE: PUT
// /users/:id
// UPDATE THE USER WITH THE SPECIFIC ID
router.put('/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body)
        res.redirect(`/users/${req.params.id}`)
    } catch (err) {
        res.sendStatus(500)
    }
})
// DELETE: DELETE
// /users/:id
// DELETE THE USER WITH THE SPECIFIC ID
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.redirect('/users')
    } catch (err) {
        res.sendStatus(500)
    }
})




module.exports = router;