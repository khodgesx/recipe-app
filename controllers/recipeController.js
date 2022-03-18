const Recipe = require('../models/recipe')
const User = require("../models/user")
const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require('cloudinary');

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: "Pics",
//     },
//   });
//   const upload = multer({ storage: storage });

const upload = multer({ dest: "./uploads/" })



//INDEX: show all recipes 
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        const currentUserId = res.locals.userId

        res.render('recipes/index.ejs', {
            recipes: recipes,
            currentUserId: currentUserId,
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
        console.log("res.locals.username", res.locals.username)
        // const recipeToSave = await User.findById(req.params.id).populate('recipe')
        // console.log(recipeToSave)
        // console.log(res.locals)
        // const isItInTheArray = true
        let currentUserObject
        let isItInTheArray

        if (currentUser) {
            currentUserObject = await User.findById(req.session.userId)
            isItInTheArray = currentUserObject.recipesSaved.includes(req.params.id)
        } else {
            isItInTheArray = false
        }

        res.render('recipes/show.ejs', {
            isItInTheArray: isItInTheArray,
            recipe: recipe,
            currentUser: currentUser,
            recipeCreator: recipeCreator,
            isLoggedIn: isLoggedIn
            // user: res.locals.user
        })
    } catch (err) {
        console.log(err)
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

router.post('/:id/saved', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.userId)
        console.log(res.locals)
        // console.log(currentUser.recipesSaved)
        currentUser.recipesSaved.push(req.params.id)
        await currentUser.save()
        // console.log(currentUser.recipesSaved)
        res.redirect(`/recipes/${req.params.id}`)
    } catch (err) {
        console.log(err)
    }
})

//unsave route:
router.post('/:id/unsave', async (req, res) => {
    const currentUser = await User.findById(req.session.userId)
    // console.log(res.locals)
    // console.log(currentUser.recipesSaved)
    currentUser.recipesSaved.pop(req.params.id)
    await currentUser.save()
    // console.log(currentUser.recipesSaved)
    res.redirect(`/recipes/${req.params.id}`)
})










//CREATE: create new recipe
// router.post('/', async (req, res) => {
//     try {
//         req.body.user = req.session.userId
//         req.body.ingredients = req.body.ingredients.split(',')
//         console.log(req.body.ingredients)
//         const recipe = await Recipe.create(req.body)
//         await Recipe.create(recipe)
//         console.log(recipe._id)
//         const recipeId = recipe._id.toString()
//         console.log(recipeId)

// const currentUser = res.locals.username
// const recipeWithUserProp = await Recipe.findById(req.params.id).populate('user')
// const recipeCreator = recipeWithUserProp.user.username
//         res.redirect(`/recipes/${recipeId}`)
//     } catch {
//         res.sendStatus(500)
//     }
// })

router.post("/", upload.single("img"), (req, res) => {
    const recipeData = req.body
    cloudinary.uploader.upload(req.file.path, res => {
        // console.log("this is the request\n", req.file.path)
        // userData.img = res.url
        console.log("this is the img result\n", res.url)
    })
        .then(imgObj => {
            console.log("is this img", imgObj)

            Recipe.create({
                name: recipeData.name,
                ingredients: recipeData.ingredients.split(','),
                summary: recipeData.summary,
                instructions: recipeData.instructions,
                readyInMinutes: recipeData.readyInMinutes,
                serving: recipeData.serving,
                img: imgObj.url,
                user: req.session.userId,
                course: req.body.course,
                vegetarian: req.body.vegetarian,
                keto: req.body.keto
            })
                .then(createdRecipe => {
                    const createdRecipeId = createdRecipe._id.toString()
                    console.log("created recipe", createdRecipe)
                    res.redirect(`/recipes/${createdRecipeId}`)
                })
        })
        .catch(err => {
            console.log(err)
        })
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

//EDIT: GET
//get the form to update the recipe photo:
// /recipe/:id/updatephoto
router.get('/:id/updatephoto', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
        res.render('recipes/update-photo.ejs', {
            recipe: recipe
        })
    } catch {
        res.sendStatus(500)
    }
})


//UPDATE: update recipe with data from edit form
// router.put('/:id', async (req, res) => {
//     try {
//         // const recipe = Recipe.findByIdAndUpdate(req.params.id)
//         req.body.ingredients = req.body.ingredients.split(',')
//         console.log(req.body.ingredients)
//         await Recipe.findByIdAndUpdate(req.params.id, req.body)
//         res.redirect(`/recipes/${req.params.id}`)
//     } catch {
//         res.sendStatus(500)
//     }
// })
//update recipe (NOT including photo):
router.put('/:id', async (req, res) => {
    try {
        console.log('hello')
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            ingredients: req.body.ingredients.split(','),
            summary: req.body.summary,
            instructions: req.body.instructions,
            readyInMinutes: req.body.readyInMinutes,
            serving: req.body.serving,
            course: req.body.course,
            vegetarian: req.body.vegetarian,
            keto: req.body.keto
        })
        console.log(updatedRecipe)
        res.redirect(`/recipes/${req.params.id}`)
    } catch (err) {
        res.send('aslkjdlasdkfj')
        console.log(err)
    }
})
//update recipe photo:
router.put('/:id/updatephoto', upload.single("img"), async (req, res) => {
    try {
        const resImgObj = await cloudinary.uploader.upload(req.file.path, resImgObj => {
            console.log('the cloudinary is doing its thing')
        })
        console.log(resImgObj)
        console.log('hello')
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, {
            img: resImgObj.url
        })
        console.log(updatedRecipe)
        res.redirect(`/recipes/${req.params.id}`)
    } catch (err) {
        res.send('aslkjdlasdkfj')
        console.log(err)
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