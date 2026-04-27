const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");

const allowedRecipeFields = [
  "chef_id",
  "category_id",
  "title",
  "description",
  "image_url",
  "difficulty",
  "prep_time",
  "total_time",
  "portions",
  "Nutritional_values",
  "Reviews",
];

const pickRecipeFields = (body) => {
  const recipeData = {};

  allowedRecipeFields.forEach((field) => {
    if (body[field] !== undefined) {
      recipeData[field] = body[field];
    }
  });

  return recipeData;
};

const listRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipe ID",
      });
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createRecipe = async (req, res) => {
  try {
    const recipeData = pickRecipeFields(req.body);
    const recipe = await Recipe.create(recipeData);

    res.status(201).json({
      success: true,
      message: "Recipe created",
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipe ID",
      });
    }

    const recipeData = pickRecipeFields(req.body);
    const recipe = await Recipe.findByIdAndUpdate(id, recipeData, {
      new: true,
      runValidators: true,
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Recipe updated",
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipe ID",
      });
    }

    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Recipe deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  listRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
