const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: { type: String, required: true },
    ingredients:
        [
            {
                name: String,
                amount: Number,
                unit: String,
                meta: String
            }
        ],
    summary: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;