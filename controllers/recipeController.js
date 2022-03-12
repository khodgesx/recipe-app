const Recipe = require('../models/recipe')
const express = require('express');
const router = express.Router();


//INDEX: show all recipes 
router.get('/', async(req, res)=>{
    try{
        const recipes = await Recipe.find();
    res.render('recipes/index.ejs', {
        recipes: recipes
    })
    }catch{
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
router.get('/new', (req, res)=>{
    res.render('recipes/new-recipe.ejs')
})

//SHOW: show specific recipe page
router.get('/:id', async (req, res)=>{
    try{
        const recipe = await Recipe.findById(req.pararms.id).populate('user')
    res.render('recipes/show.ejs', {
        recipe:recipe
    })
    }catch{
        res.sendStatus(500)
    }
})

//CREATE: create new recipe
router.post('/', async (req, res)=>{
    try{
        req.body.user = req.session.userId
        const newRecipe = await Recipe.create(req.body)
        res.redirect('recipes/show.ejs', {
            newRecipe : newRecipe
        })
    }catch{
        res.sendStatus(500)
    }
})

//EDIT: form to edit a specific recipe 
router.get('/:id/edit', async (req, res)=>{
    try{
        const recipe = await Recipe.findById(req.params.id)
    res.render('recipes/edit.ejs', {
        recipe: recipe
    })
    }catch{
        res.sendStatus(500)
    } 
})

//UPDATE: update recipe with data from edit form
router.put('/:id', async (req, res)=>{
    try{
        await Recipe.findByIdAndUpdate(req.params.id, req.body)
        res.redirect(`/recipes/${req.params.id}`)
    }catch{
        res.sendStatus(500)
    }
})

//DELETE: delete a specific recipe 
router.delete('/:id', async (req, res)=>{
    try{
        await Recipe.findByIdAndDelete(req.params.id)
        res.redirect('/recipes')
    }catch{
        res.sendStatus(500)
    }
})




module.exports = router;