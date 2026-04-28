const mongoose = require("mongoose");
const Favorite = require("../models/Favorite");
const Recipe = require("../models/Recipe");
const createError = require("../utils/createError");
const { formatRecipeWithIngredients } = require("../utils/formatRecipe");

const favoritePopulate = {
  path: "recipe_id",
  select: "chef_id category_id title description image_url difficulty prep_time total_time portions Nutritional_values Reviews created_at",
  populate: [
    { path: "chef_id", select: "name email role" },
    { path: "category_id", select: "name" },
  ],
};

class FavoriteController {
  constructor() {
    this.listFavorites = this.listFavorites.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
  }

  isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  async ensureRecipeExists(recipeId) {
    if (!this.isValidObjectId(recipeId)) {
      throw createError(400, "Recipe id must be valid");
    }

    const recipeExists = await Recipe.exists({ _id: recipeId });

    if (!recipeExists) {
      throw createError(404, "Recipe not found");
    }
  }

  async formatFavorite(favorite) {
    const favoriteObject = favorite.toObject ? favorite.toObject() : favorite;

    return {
      ...favoriteObject,
      recipe_id: await formatRecipeWithIngredients(favorite.recipe_id),
    };
  }

  async listFavorites(req, res, next) {
    try {
      const favorites = await Favorite.find({ user_id: req.user.id })
        .sort({ saved_at: -1 })
        .populate(favoritePopulate);
      const favoritesWithRecipes = await Promise.all(favorites.map((favorite) => this.formatFavorite(favorite)));

      return res.status(200).json({
        success: true,
        count: favoritesWithRecipes.length,
        data: favoritesWithRecipes,
      });
    } catch (error) {
      return next(error);
    }
  }

  async addFavorite(req, res, next) {
    try {
      const { recipe_id } = req.body;

      await this.ensureRecipeExists(recipe_id);

      const existingFavorite = await Favorite.findOne({
        user_id: req.user.id,
        recipe_id,
      }).populate(favoritePopulate);

      if (existingFavorite) {
        return res.status(200).json({
          success: true,
          message: "Recipe is already in favorites",
          data: await this.formatFavorite(existingFavorite),
        });
      }

      const favorite = await Favorite.create({
        user_id: req.user.id,
        recipe_id,
      });

      const populatedFavorite = await Favorite.findById(favorite._id).populate(favoritePopulate);

      return res.status(201).json({
        success: true,
        message: "Recipe added to favorites",
        data: await this.formatFavorite(populatedFavorite),
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(createError(409, "Recipe is already in favorites"));
      }

      return next(error);
    }
  }

  async removeFavorite(req, res, next) {
    try {
      const { recipeId } = req.params;

      if (!this.isValidObjectId(recipeId)) {
        throw createError(400, "Recipe id must be valid");
      }

      const favorite = await Favorite.findOneAndDelete({
        user_id: req.user.id,
        recipe_id: recipeId,
      });

      if (!favorite) {
        return next(createError(404, "Favorite not found"));
      }

      return res.status(200).json({
        success: true,
        message: "Recipe removed from favorites",
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new FavoriteController();
