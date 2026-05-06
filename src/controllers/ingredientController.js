const mongoose = require("mongoose");
const Ingredient = require("../models/Ingredient");
const RecipeIngredient = require("../models/RecipeIngredient");
const createError = require("../utils/createError");
const {
  escapeRegex,
  getPagination,
  getPaginationMeta,
} = require("../utils/queryHelpers");

class IngredientController {
  normalizeError(error) {
    if (error.statusCode) return error;

    if (error.name === "ValidationError") {
      return createError(400, error.message);
    }

    if (error.code === 11000) {
      return createError(409, "Ingredient already exists");
    }

    return error;
  }

  async listIngredients(req, res, next) {
    try {
      const filter = {};
      const search = req.query.search || req.query.q || req.query.name;

      if (search) {
        filter.name = new RegExp(escapeRegex(String(search).trim().toLowerCase()), "i");
      }

      if (req.query.unit) {
        filter.unit = String(req.query.unit).trim().toLowerCase();
      }

      const shouldPaginate = req.query.page !== undefined || req.query.limit !== undefined;
      const { page, limit, skip } = getPagination(req.query, { defaultLimit: 50 });
      const query = Ingredient.find(filter).sort({ name: 1 });

      if (shouldPaginate) {
        query.skip(skip).limit(limit);
      }

      const [total, ingredients] = await Promise.all([
        Ingredient.countDocuments(filter),
        query,
      ]);

      res.status(200).json({
        success: true,
        count: ingredients.length,
        ...(shouldPaginate ? { pagination: getPaginationMeta(total, page, limit, ingredients.length) } : {}),
        data: ingredients,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async createIngredient(req, res, next) {
    try {
      const { name, unit } = req.body;

      if (!name) {
        return next(createError(400, "Name is required"));
      }

      const normalizedName = name.trim().toLowerCase();
      const existing = await Ingredient.findOne({ name: normalizedName });

      if (existing) {
        return next(createError(409, "Ingredient already exists"));
      }

      const ingredientData = { name: normalizedName };

      if (unit) {
        ingredientData.unit = unit;
      }

      const ingredient = await Ingredient.create(ingredientData);

      res.status(201).json({
        success: true,
        message: "Ingredient created",
        data: ingredient,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async deleteIngredient(req, res, next) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createError(400, "Invalid ingredient ID"));
      }

      const usedIngredient = await RecipeIngredient.exists({ ingredient_id: id });

      if (usedIngredient) {
        return next(createError(400, "Cannot delete ingredient because it is used in recipes"));
      }

      const ingredient = await Ingredient.findByIdAndDelete(id);

      if (!ingredient) {
        return next(createError(404, "Ingredient not found"));
      }

      res.status(200).json({
        success: true,
        message: "Ingredient deleted",
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}

const ingredientController = new IngredientController();

ingredientController.listIngredients = ingredientController.listIngredients.bind(ingredientController);
ingredientController.createIngredient = ingredientController.createIngredient.bind(ingredientController);
ingredientController.deleteIngredient = ingredientController.deleteIngredient.bind(ingredientController);

module.exports = ingredientController;
