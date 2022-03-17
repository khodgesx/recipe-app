const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: { type: String, required: true },
    // const ingredientsSchema = new Schema ({
    //     [
    //         {
    //             name: String,
    //             amount: Number,
    //             unit: String,
    //             meta: String
    //         }
    //     ]
    // }),
    ingredients: [String],
    summary: String,
    readyInMinutes: Number,
    serving: Number,
    img: String,
    instructions: String,
    vegetarian: Boolean,
    keto: Boolean,
    course: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;