const Recipe = require('../models/recipe')
const User = require("../models/user")
const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require('cloudinary');

// Set remote cloudinary folder destination
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
//NEW: form to create new recipe 
router.get('/new', [isLoggedIn], (req, res) => {
    res.render('recipes/new-recipe.ejs')
})
//SHOW: show specific recipe page
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
        const currentUser = res.locals.username
        const recipeWithUserProp = await Recipe.findById(req.params.id).populate('user')
        const recipeCreator = recipeWithUserProp.user.username
        const creatorName = recipeWithUserProp.user.firstName
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
            isLoggedIn: isLoggedIn,
            creatorName: creatorName
        })
    } catch (err) {
        console.log(err)
        res.send('error at the show: recipes/:id route')
    }
})
// SAVE RECIPE ROUTE:
router.post('/:id/saved', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.userId)
        const ourRecipe = await Recipe.findById(req.params.id)
        let savedNumber = ourRecipe.savedCounter
        savedNumber++
        ourRecipe.savedCounter = savedNumber
        await ourRecipe.save()
        currentUser.recipesSaved.push(req.params.id)
        await currentUser.save()
        res.redirect(`/recipes/${req.params.id}`)
    } catch (err) {
        console.log(err)
    }
})
// UNSAVE RECIPE ROUTE:
router.post('/:id/unsave', async (req, res) => {
    const currentUser = await User.findById(req.session.userId)
    const ourRecipe = await Recipe.findById(req.params.id)
    let savedNumber = ourRecipe.savedCounter
    savedNumber--
    ourRecipe.savedCounter = savedNumber
    await ourRecipe.save()
    currentUser.recipesSaved.pop(req.params.id)
    await currentUser.save()
    res.redirect(`/recipes/${req.params.id}`)
})
// CREATE RECIPE ROUTE:
router.post("/", upload.single("img"), (req, res) => {
    const recipeData = req.body
    cloudinary.uploader.upload(req.file.path, res => {
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
        })
        console.log('hello')
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, {
            img: resImgObj.url
        })
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