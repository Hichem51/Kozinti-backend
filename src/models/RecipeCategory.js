const mongoose = require("mongoose");

const recipeCategorySchema = new mongoose.Schema({
  recipe_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

recipeCategorySchema.index({ recipe_id: 1, category_id: 1 }, { unique: true });

module.exports = mongoose.model("RecipeCategory", recipeCategorySchema);
