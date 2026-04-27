const mongoose = require("mongoose");
const Ingredient = require("../models/Ingredient");

const listIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ingredients.length,
      data: ingredients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createIngredient = async (req, res) => {
  try {
    const { name, unit } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!unit) {
      return res.status(400).json({
        success: false,
        message: "Unit is required",
      });
    }
    const existing = await Ingredient.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Ingredient already exists",
      });
    }
    const ingredient = await Ingredient.create({ name, unit });
    res.status(201).json({
      success: true,
      message: "Ingredient created",
      data: ingredient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ingredient ID",
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  listIngredients,
  createIngredient,
  deleteIngredient,
};
