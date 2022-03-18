const User = require("../models/user")
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Recipe = require("../models/recipe");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require('cloudinary');
const isLoggedIn = require('../middleware/isLoggedIn')


// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "Pics",
//     },
// });
// const upload = multer({ storage: storage });

const upload = multer({ dest: "./uploads/" })

//test

// INDEX: GET
// /users
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
// /users/new
// Shows a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new-user.ejs')
})


// SHOW: GET
// /users/:id
// Shows users profile page
router.get('/:id', [isLoggedIn], async (req, res) => {
    try {
        console.log('hello entering')
        const user = await User.findById(req.params.id)
        const currentUserId = req.session.userId
        const currentUserIdString = req.session.userId.toString()

        console.log("hello")
        // console.log(currentUserId)
        // console.log(user._id)


        const recipesMadeArray = await Recipe.find({ user: req.params.id }).populate('user')
        userWithSavedRecipes = await user.populate('recipesSaved')
        const recipesSavedArray = userWithSavedRecipes.recipesSaved
        // console.log(recipesMadeArray)
        // console.log(recipesSavedArray)
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
        currentUser: currentUser,
        recipes: recipes
    })
})



// CREATE: POST (OLD ROUTE)
// /users
// Creates an actual user, then...?
// router.post('/', async (req, res) => {
//     // req.body.password needs to be HASHED
//     console.log(req.body)
//     const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
//     console.log(hashedPassword)
//     req.body.password = hashedPassword
//     const newUser = await User.create(req.body);
//     console.log(newUser)
//     res.redirect('/login')
// })

//CREATE: POST create new user with image upload 
router.post("/", upload.single("img"), (req, res) => {
    const userData = req.body
    cloudinary.uploader.upload(req.file.path, res => {
        // console.log("this is the request\n", req.file.path)
        // userData.img = res.url
        console.log("this is the img result\n", res.url)
    })
        .then(imgObj => {
            console.log("is this img", imgObj)
            User.create({
                username: userData.username,
                firstName: userData.firstName,
                lastName: userData.lastName,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
                email: userData.email,
                img: imgObj.url
            })
                .then(createdUser => {
                    console.log("created user", createdUser)
                    res.redirect('/login')
                })
        })
        .catch(err => {
            console.log(err)
        })
})


// EDIT: GET
// /users/:id/edit
// SHOW THE FORM TO EDIT A USER 
router.get('/:id/edit', async (req, res) => {
    try {
        if (req.session.userId == req.params.id) {
            console.log("=========================")
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
// /users/:id/editpassword
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
// /users/:id/updatephoto
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
// User.findOneAndUpdate({username: req.params.username}, { $set: req.body }, { new: true }, callback);
// UPDATE: PUT
// /users/:id
// UPDATE THE USER WITH THE SPECIFIC ID
// router.post("/", upload.single("img"), (req, res) => {
//     const userData = req.body
//     cloudinary.uploader.upload(req.file.path, res => {
//         // console.log("this is the request\n", req.file.path)
//         // userData.img = res.url
//         console.log("this is the img result\n", res.url)
//     })

//UPDATE PUT: update user with :id 
//this route does not work because of the photo part
// router.put('/:id', upload.single("img"), async (req, res) => {
//     try {
//         const resImgObj = await cloudinary.uploader.upload(req.file.path, resImgObj => {
//             console.log('the cloudinary is doing its thing')
//         })
//         console.log(resImgObj)
//         console.log('hello')
//         const updatedUser = await User.findByIdAndUpdate(req.params.id, {
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             img: resImgObj.url,
//             email: req.body.email
//         })
//         console.log(updatedUser)
//         res.redirect(`/users/${req.params.id}`)
//     } catch (err) {
//         res.send('aslkjdlasdkfj')
//         console.log(err)
//     }
// })
//UPDATE PUT: update user with :id 
//this route does not work because of the photo part
router.put('/:id', async (req, res) => {
    try {

        console.log('hello')
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
        })
        console.log("update user:", updatedUser)
        res.redirect(`/users/${req.params.id}`)
    } catch (err) {
        console.log(err)
    }
})



// UPDATE THE USER'S PASSWORD WITH THE SPECIFIC ID
router.put('/:id/editpassword', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.session.userId, {
            password: bcrypt.hashSync(req.body.password, 10),
        })
        console.log(updatedUser)
        res.redirect(`/users/${req.params.id}`)
    } catch (err) {
        res.send('did not update password')
        console.log(err)
    }
})
//UPDATE USER PHOTO : /users/:id/updatephoto
router.put('/:id/updatephoto', upload.single("img"), async (req, res) => {
    try {
        const resImgObj = await cloudinary.uploader.upload(req.file.path, resImgObj => {
            console.log('the cloudinary is doing its thing')
        })
        console.log(resImgObj)
        console.log('hello')
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {

            img: resImgObj.url

        })
        // console.log(updatedUser)
        res.redirect(`/users/${req.params.id}`)
    } catch (err) {
        res.send('aslkjdlasdkfj')
        console.log(err)
    }
})

//THIS WAS THE OLD ROUTE WITH EVERYTHING BUT PASSWORD IN THE FORM
//UPDATE PUT: update user with :id 
//this route does not work because of the photo part
// router.put('/:id', upload.single("img"), async (req, res) => {
//     try {
//         const resImgObj = await cloudinary.uploader.upload(req.file.path, resImgObj => {
//             console.log('the cloudinary is doing its thing')
//         })
//         console.log(resImgObj)
//         console.log('hello')
//         const updatedUser = await User.findByIdAndUpdate(req.params.id, {
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             img: resImgObj.url,
//             email: req.body.email
//         })
//         console.log(updatedUser)
//         res.redirect(`/users/${req.params.id}`)
//     } catch (err) {
//         res.send('aslkjdlasdkfj')
//         console.log(err)
//     }
// })

// SHOW: GET
// /users/:id/created
// Shows a page displaying all the recipes created by the user
router.get('/:id/created', async (req, res) => {
    try {
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
    } catch (err) {
        console.log(err)
        res.send(err)
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




module.exports = router