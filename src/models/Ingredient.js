const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  unit: {
    type: String,
    trim: true,
    default: "",
  },
});

module.exports = mongoose.model("Ingredient", ingredientSchema);
