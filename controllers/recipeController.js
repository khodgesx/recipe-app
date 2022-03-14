const Recipe = require('../models/recipe')
const User = require("../models/user")
const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn')



//INDEX: show all recipes 
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        const currentUserId = res.locals.userId
        res.render('recipes/index.ejs', {
            recipes: recipes,
            currentUserId: currentUserId
        })
    } catch {
        res.sendStatus(500)
    }
})

//INDEX: show search of recipes from our database
//need to route to a show page of results
// router.get('/search/:id', async(req, res)=>{
//     const matchedRecipes = await Recipe.find();
//     res.render('/recipes/show.ejs', {
//         matchedRecipes : matchedRecipes
//     })
// })

//NEW: form to create new recipe 
//adding [isLoggedIn] to this route specifically
router.get('/new', [isLoggedIn], (req, res) => {
    res.render('recipes/new-recipe.ejs')
})

//SHOW: show specific recipe page
router.get('/:id', async (req, res) => {
    
    try {
        const recipe = await Recipe.findById(req.params.id)
        // console.log(recipe._id)
        const currentUser = res.locals.username
        const recipeWithUserProp = await Recipe.findById(req.params.id).populate('user')
        const recipeCreator = recipeWithUserProp.user.username
        // const recipeToSave = await User.findById(req.params.id).populate('recipe')
        // console.log(recipeToSave)
        // console.log(res.locals)

        res.render('recipes/show.ejs', {
            recipe: recipe,
            currentUser : currentUser,
            recipeCreator: recipeCreator            
           
        })
    } catch {
        res.send('error at the show: recipes/:id route')
    }
})
//CREATE: saved recipe
// router.post('/:id/saved', async (req, res)=>{
//     const currentUser = res.locals
//     const recipe = await Recipe.findById(req.params.id)
//     const recipeWithUserProp = await Recipe.findById(req.params.id).populate('user')
//     const recipeCreator = recipeWithUserProp.user.username
//     //this is the recipesSaved array -- add to index-saved.ejs
//     const recipeToSave = await User.findById(req.params.id).populate('recipe')
//     res.render('recipes/show.ejs', {
//         currentUser : currentUser,
//         recipeToSave : recipeToSave,
//         recipe : recipe,
//         recipeCreator:recipeCreator,

//     })

// })


// display a button to save the recipe on a show page
    // form with a button
    // hidden input where the value is that recipe's object id
    // <input hidden name="recipeId" value=<%= recipe._id %>/>

router.post('/:id/saved', async (req, res)=>{
    const currentUser = await User.findById(req.session.userId)
    console.log(res.locals)
    console.log(currentUser.recipesSaved)
    currentUser.recipesSaved.push(req.params.id)
    await currentUser.save()
    console.log(currentUser.recipesSaved)
    res.redirect(`/recipes/${req.params.id}`)
})

//CREATE: create new recipe
router.post('/', async (req, res) => {
        try {
            req.body.user = req.session.userId
            req.body.ingredients = req.body.ingredients.split(',')
            const recipe = await Recipe.create(req.body)
            // const recipe = {
            //     name: req.body.name,
            //     ingredients:
            //         [
            //             {
            //                 name: req.body.ingredients,
            //                 amount: req.body.amount,
            //                 unit: req.body.unit,
            //                 meta: req.body.meta
            //             }
            //         ],
            //     summary: req.body.summary,
            //     readyInMinutes: req.body.readyInMinutes,
            //     serving: req.body.serving,
            //     img: req.body.img
            // }
            await Recipe.create(recipe)
            console.log(recipe._id)
            const recipeId = recipe._id.toString()
            console.log(recipeId)
          
            // const currentUser = res.locals.username
            // const recipeWithUserProp = await Recipe.findById(req.params.id).populate('user')
            // const recipeCreator = recipeWithUserProp.user.username
            res.redirect(`/recipes/${recipeId}`)
        } catch {
            res.sendStatus(500)
        }
   
})

//EDIT: form to edit a specific recipe 
router.get('/:id/edit', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
        res.render('recipes/edit.ejs', {
            recipe: recipe
        })
    } catch {
        res.sendStatus(500)
    }
})

//UPDATE: update recipe with data from edit form
router.put('/:id', async (req, res) => {
    try {
        await Recipe.findByIdAndUpdate(req.params.id, req.body)
        res.redirect(`/recipes/${req.params.id}`)
    } catch {
        res.sendStatus(500)
    }
})

//DELETE: delete a specific recipe 
router.delete('/:id', async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id)
        res.redirect('/recipes')
    } catch {
        res.sendStatus(500)
    }
})




module.exports = router;