const mongoose = require("mongoose");

const recipeIngredientSchema = new mongoose.Schema({
  recipe_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  ingredient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ingredient",
    required: true,
  },
  quantity: {
    type: Number,
    min: 0,
    default: 0,
  },
  notes: {
    type: String,
    trim: true,
    default: "",
  },
});

recipeIngredientSchema.index({ recipe_id: 1, ingredient_id: 1 }, { unique: true });

module.exports = mongoose.model("RecipeIngredient", recipeIngredientSchema);
