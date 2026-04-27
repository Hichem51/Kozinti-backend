const mongoose = require("mongoose");
const Ingredient = require("../models/Ingredient");
const RecipeIngredient = require("../models/RecipeIngredient");

class IngredientController {
  sendError(res, error) {
    const statusCode = error.name === "ValidationError" || error.code === 11000 ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.code === 11000 ? "Ingredient already exists" : error.message,
    });
  }

  async listIngredients(req, res) {
    try {
      const ingredients = await Ingredient.find().sort({ name: 1 });

      res.status(200).json({
        success: true,
        count: ingredients.length,
        data: ingredients,
      });
    } catch (error) {
      this.sendError(res, error);
    }
  }

  async createIngredient(req, res) {
    try {
      const { name, unit } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Name is required",
        });
      }

      const normalizedName = name.trim().toLowerCase();
      const existing = await Ingredient.findOne({ name: normalizedName });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Ingredient already exists",
        });
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
      this.sendError(res, error);
    }
  }

  async deleteIngredient(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ingredient ID",
        });
      }

      const usedIngredient = await RecipeIngredient.exists({ ingredient_id: id });

      if (usedIngredient) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete ingredient because it is used in recipes",
        });
      }

      const ingredient = await Ingredient.findByIdAndDelete(id);

      if (!ingredient) {
        return res.status(404).json({
          success: false,
          message: "Ingredient not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Ingredient deleted",
      });
    } catch (error) {
      this.sendError(res, error);
    }
  }
}

const ingredientController = new IngredientController();

ingredientController.listIngredients = ingredientController.listIngredients.bind(ingredientController);
ingredientController.createIngredient = ingredientController.createIngredient.bind(ingredientController);
ingredientController.deleteIngredient = ingredientController.deleteIngredient.bind(ingredientController);

module.exports = ingredientController;
