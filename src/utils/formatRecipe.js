const RecipeIngredient = require("../models/RecipeIngredient");

const recipeIngredientPopulate = {
  path: "ingredient_id",
  select: "name unit",
};

const getRecipeIngredients = (recipeId) => {
  return RecipeIngredient.find({ recipe_id: recipeId })
    .sort({ _id: 1 })
    .populate(recipeIngredientPopulate);
};

const formatRecipeWithIngredients = async (recipe) => {
  if (!recipe) {
    return null;
  }

  const recipeObject = recipe.toObject ? recipe.toObject() : recipe;
  const ingredients = await getRecipeIngredients(recipeObject._id);

  return {
    ...recipeObject,
    ingredients,
  };
};

module.exports = {
  formatRecipeWithIngredients,
  getRecipeIngredients,
};
