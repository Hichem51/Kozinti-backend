const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  
  measurement_type: {
    type: String,
    enum: ["g", "ml", "pcs", "tbsp", "tsp", "cup", "oz", "lb", "l", "mg", "cl", "kg", "leaves"],
    default: "g",
  },
});

module.exports = mongoose.model("Ingredient", ingredientSchema);
