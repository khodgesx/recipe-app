const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: {type:String, required: true},
    extendedIngredients:
    [
        {name: String, 
        amount: Number,
        unit: Number,
        meta: String,}
    ],
    Summary: String,
    user: {type: Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true})

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;