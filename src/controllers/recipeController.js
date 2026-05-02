const mongoose = require("mongoose");
const Category = require("../models/Category");
const Ingredient = require("../models/Ingredient");
const Recipe = require("../models/Recipe");
const RecipeIngredient = require("../models/RecipeIngredient");
const { formatRecipeWithIngredients } = require("../utils/formatRecipe");

const allowedRecipeFields = [
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

class RecipeController {
  constructor() {
    this.listRecipes = this.listRecipes.bind(this);
    this.getRecipeById = this.getRecipeById.bind(this);
    this.createRecipe = this.createRecipe.bind(this);
    this.updateRecipe = this.updateRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }

  createHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  }

  isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  pickRecipeFields(body) {
    const recipeData = {};

    allowedRecipeFields.forEach((field) => {
      if (body[field] !== undefined) {
        recipeData[field] = body[field];
      }
    });

    return recipeData;
  }

  normalizeIngredients(ingredients) {
    if (ingredients === undefined) return undefined;

    if (!Array.isArray(ingredients)) {
      throw this.createHttpError(400, "Ingredients must be an array");
    }

    return ingredients.map((item, index) => {
      if (!item || typeof item !== "object") {
        throw this.createHttpError(400, `Ingredient at position ${index + 1} is invalid`);
      }

      const { ingredient_id, quantity, notes } = item;

      if (!this.isValidObjectId(ingredient_id)) {
        throw this.createHttpError(400, `Ingredient id at position ${index + 1} is invalid`);
      }

      if (quantity === undefined || String(quantity).trim() === "") {
        throw this.createHttpError(400, `Ingredient quantity at position ${index + 1} is required`);
      }

      return {
        ingredient_id,
        quantity: String(quantity).trim(),
        notes: notes === undefined ? "" : String(notes).trim(),
      };
    });
  }

  async ensureDocumentExists(Model, id, invalidMessage, notFoundMessage) {
    if (id === undefined) return;

    if (!this.isValidObjectId(id)) {
      throw this.createHttpError(400, invalidMessage);
    }

    const exists = await Model.exists({ _id: id });

    if (!exists) {
      throw this.createHttpError(404, notFoundMessage);
    }
  }

  async ensureIngredientsExist(ingredients) {
    if (ingredients === undefined || ingredients.length === 0) return;

    const ingredientIds = [...new Set(ingredients.map((item) => item.ingredient_id.toString()))];

    if (ingredientIds.length !== ingredients.length) {
      throw this.createHttpError(400, "Recipe ingredients cannot contain duplicates");
    }

    const count = await Ingredient.countDocuments({ _id: { $in: ingredientIds } });

    if (count !== ingredientIds.length) {
      throw this.createHttpError(404, "One or more ingredients were not found");
    }
  }

  async ensureRecipeTitleIsUnique(title, excludedRecipeId) {
    if (title === undefined) return;

    const normalizedTitle = String(title).trim();
    const existingRecipe = await Recipe.findOne({
      title: new RegExp(`^${this.escapeRegex(normalizedTitle)}$`, "i"),
      ...(excludedRecipeId ? { _id: { $ne: excludedRecipeId } } : {}),
    });

    if (existingRecipe) {
      throw this.createHttpError(409, "Recipe title already exists");
    }
  }

  async prepareRecipeData(body) {
    const recipeData = this.pickRecipeFields(body);

    await this.ensureDocumentExists(Category, recipeData.category_id, "Invalid category ID", "Category not found");

    return recipeData;
  }

  async createRecipeIngredients(recipeId, ingredients) {
    if (ingredients === undefined) return;

    await RecipeIngredient.create(
      ingredients.map((ingredient) => ({
        recipe_id: recipeId,
        ingredient_id: ingredient.ingredient_id,
        quantity: ingredient.quantity,
        notes: ingredient.notes,
      }))
    );
  }

  async replaceRecipeIngredients(recipeId, ingredients) {
    if (ingredients === undefined) return;

    await RecipeIngredient.deleteMany({ recipe_id: recipeId });
    await this.createRecipeIngredients(recipeId, ingredients);
  }

  normalizeError(error) {
    if (error.statusCode) return error;

    if (error.name === "ValidationError") {
      return this.createHttpError(400, error.message);
    }

    if (error.code === 11000) {
      return this.createHttpError(409, "Recipe title already exists");
    }

    return error;
  }

  async listRecipes(req, res, next) {
    try {
      const recipes = await Recipe.find().sort({ created_at: -1 }).populate(recipePopulate);
      const recipesWithIngredients = await Promise.all(
        recipes.map((recipe) => formatRecipeWithIngredients(recipe))
      );

      res.status(200).json({
        success: true,
        count: recipesWithIngredients.length,
        data: recipesWithIngredients,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async getRecipeById(req, res, next) {
    try {
      const { id } = req.params;

      if (!this.isValidObjectId(id)) {
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
        data: await formatRecipeWithIngredients(recipe),
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async createRecipe(req, res, next) {
    try {
      const recipeData = await this.prepareRecipeData(req.body);

      recipeData.chef_id = req.user.id;

      const ingredients = this.normalizeIngredients(req.body.ingredients);
      await this.ensureIngredientsExist(ingredients);
      await this.ensureRecipeTitleIsUnique(recipeData.title);

      const recipe = await Recipe.create(recipeData);
      await this.createRecipeIngredients(recipe._id, ingredients);

      const populatedRecipe = await Recipe.findById(recipe._id).populate(recipePopulate);

      res.status(201).json({
        success: true,
        message: "Recipe created",
        data: await formatRecipeWithIngredients(populatedRecipe),
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async updateRecipe(req, res, next) {
    try {
      const { id } = req.params;

      if (!this.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid recipe ID",
        });
      }

      const existingRecipe = await Recipe.findById(id);

      if (!existingRecipe) {
        return res.status(404).json({
          success: false,
          message: "Recipe not found",
        });
      }

      if (
        req.user.role === "chef" &&
        existingRecipe.chef_id.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own recipes",
        });
      }

      const recipeData = await this.prepareRecipeData(req.body);
      const ingredients = this.normalizeIngredients(req.body.ingredients);

      await this.ensureIngredientsExist(ingredients);
      await this.ensureRecipeTitleIsUnique(recipeData.title, id);

      if (Object.keys(recipeData).length === 0 && ingredients === undefined) {
        return res.status(400).json({
          success: false,
          message: "No valid recipe fields were provided",
        });
      }

      const updatedRecipe =
        Object.keys(recipeData).length > 0
          ? await Recipe.findByIdAndUpdate(id, recipeData, {
              new: true,
              runValidators: true,
            }).populate(recipePopulate)
          : await Recipe.findById(id).populate(recipePopulate);

      await this.replaceRecipeIngredients(updatedRecipe._id, ingredients);

      res.status(200).json({
        success: true,
        message: "Recipe updated",
        data: await formatRecipeWithIngredients(updatedRecipe),
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async deleteRecipe(req, res, next) {
    try {
      const { id } = req.params;

      if (!this.isValidObjectId(id)) {
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

      if (
        req.user.role === "chef" &&
        recipe.chef_id.toString() !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own recipes",
        });
      }

      await Recipe.findByIdAndDelete(id);
      await RecipeIngredient.deleteMany({ recipe_id: recipe._id });

      res.status(200).json({
        success: true,
        message: "Recipe deleted",
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}

module.exports = new RecipeController();
