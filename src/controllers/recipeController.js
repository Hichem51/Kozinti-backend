const mongoose = require("mongoose");
const Category = require("../models/Category");
const Ingredient = require("../models/Ingredient");
const Recipe = require("../models/Recipe");
const RecipeIngredient = require("../models/RecipeIngredient");
const User = require("../models/User");

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

const recipePopulate = [
  { path: "chef_id", select: "name email role" },
  { path: "category_id", select: "name" },
];

const recipeIngredientPopulate = {
  path: "ingredient_id",
  select: "name unit",
};

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const pickRecipeFields = (body) => {
  const recipeData = {};

  allowedRecipeFields.forEach((field) => {
    if (body[field] !== undefined) {
      recipeData[field] = body[field];
    }
  });

  return recipeData;
};

const normalizeIngredients = (ingredients) => {
  if (ingredients === undefined) {
    return undefined;
  }

  if (!Array.isArray(ingredients)) {
    throw createHttpError(400, "Ingredients must be an array");
  }

  return ingredients.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw createHttpError(400, `Ingredient at position ${index + 1} is invalid`);
    }

    const { ingredient_id, quantity, notes } = item;

    if (!isValidObjectId(ingredient_id)) {
      throw createHttpError(400, `Ingredient id at position ${index + 1} is invalid`);
    }

    if (quantity === undefined || String(quantity).trim() === "") {
      throw createHttpError(400, `Ingredient quantity at position ${index + 1} is required`);
    }

    return {
      ingredient_id,
      quantity: String(quantity).trim(),
      notes: notes === undefined ? "" : String(notes).trim(),
    };
  });
};

const ensureDocumentExists = async (Model, id, invalidMessage, notFoundMessage) => {
  if (id === undefined) {
    return;
  }

  if (!isValidObjectId(id)) {
    throw createHttpError(400, invalidMessage);
  }

  const exists = await Model.exists({ _id: id });

  if (!exists) {
    throw createHttpError(404, notFoundMessage);
  }
};

const ensureIngredientsExist = async (ingredients) => {
  if (ingredients === undefined || ingredients.length === 0) {
    return;
  }

  const ingredientIds = [...new Set(ingredients.map((item) => item.ingredient_id.toString()))];

  if (ingredientIds.length !== ingredients.length) {
    throw createHttpError(400, "Recipe ingredients cannot contain duplicates");
  }

  const count = await Ingredient.countDocuments({ _id: { $in: ingredientIds } });

  if (count !== ingredientIds.length) {
    throw createHttpError(404, "One or more ingredients were not found");
  }
};

const prepareRecipeData = async (body) => {
  const recipeData = pickRecipeFields(body);

  await ensureDocumentExists(User, recipeData.chef_id, "Invalid chef ID", "Chef not found");
  await ensureDocumentExists(Category, recipeData.category_id, "Invalid category ID", "Category not found");

  return recipeData;
};

const getRecipeIngredients = async (recipeId) => {
  return RecipeIngredient.find({ recipe_id: recipeId })
    .sort({ _id: 1 })
    .populate(recipeIngredientPopulate);
};

const formatRecipe = async (recipe) => {
  const recipeObject = recipe.toObject ? recipe.toObject() : recipe;
  const ingredients = await getRecipeIngredients(recipeObject._id);

  return {
    ...recipeObject,
    ingredients,
  };
};

const createRecipeIngredients = async (recipeId, ingredients) => {
  if (ingredients === undefined) {
    return;
  }

  await RecipeIngredient.create(
    ingredients.map((ingredient) => ({
      recipe_id: recipeId,
      ingredient_id: ingredient.ingredient_id,
      quantity: ingredient.quantity,
      notes: ingredient.notes,
    }))
  );
};

const replaceRecipeIngredients = async (recipeId, ingredients) => {
  if (ingredients === undefined) {
    return;
  }

  await RecipeIngredient.deleteMany({ recipe_id: recipeId });
  await createRecipeIngredients(recipeId, ingredients);
};

const sendError = (res, error) => {
  const statusCode = error.statusCode || (error.name === "ValidationError" ? 400 : 500);

  res.status(statusCode).json({
    success: false,
    message: error.message,
  });
};

const listRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ created_at: -1 }).populate(recipePopulate);
    const recipesWithIngredients = await Promise.all(recipes.map((recipe) => formatRecipe(recipe)));

    res.status(200).json({
      success: true,
      count: recipesWithIngredients.length,
      data: recipesWithIngredients,
    });
  } catch (error) {
    sendError(res, error);
  }
};

const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipe ID",
      });
    }

    const recipe = await Recipe.findById(id).populate(recipePopulate);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      success: true,
      data: await formatRecipe(recipe),
    });
  } catch (error) {
    sendError(res, error);
  }
};

const createRecipe = async (req, res) => {
  try {
    const recipeData = await prepareRecipeData(req.body);
    const ingredients = normalizeIngredients(req.body.ingredients);

    await ensureIngredientsExist(ingredients);

    const recipe = await Recipe.create(recipeData);
    await createRecipeIngredients(recipe._id, ingredients);

    const populatedRecipe = await Recipe.findById(recipe._id).populate(recipePopulate);

    res.status(201).json({
      success: true,
      message: "Recipe created",
      data: await formatRecipe(populatedRecipe),
    });
  } catch (error) {
    sendError(res, error);
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipe ID",
      });
    }

    const recipeData = await prepareRecipeData(req.body);
    const ingredients = normalizeIngredients(req.body.ingredients);

    await ensureIngredientsExist(ingredients);

    if (Object.keys(recipeData).length === 0 && ingredients === undefined) {
      return res.status(400).json({
        success: false,
        message: "No valid recipe fields were provided",
      });
    }

    const recipe =
      Object.keys(recipeData).length > 0
        ? await Recipe.findByIdAndUpdate(id, recipeData, {
            new: true,
            runValidators: true,
          }).populate(recipePopulate)
        : await Recipe.findById(id).populate(recipePopulate);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    await replaceRecipeIngredients(recipe._id, ingredients);

    res.status(200).json({
      success: true,
      message: "Recipe updated",
      data: await formatRecipe(recipe),
    });
  } catch (error) {
    sendError(res, error);
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
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

    await RecipeIngredient.deleteMany({ recipe_id: recipe._id });

    res.status(200).json({
      success: true,
      message: "Recipe deleted",
    });
  } catch (error) {
    sendError(res, error);
  }
};

module.exports = {
  listRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
