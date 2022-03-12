const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {type: String, required:true},
    lastName: String,
    username: { type: String, unique: true, required: true, minlength: 2 },
    password: { type: String, required: true },
    email: { type: String, required: true },
    recipesMade: { type: Number, min: 0, default: 0 },
    recipesSaved: [],
    img: { type: String }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

module.exports = User;