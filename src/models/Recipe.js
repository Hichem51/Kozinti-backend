const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  chef_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 140,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  image_url: {
    type: String,
    trim: true,
    default: "",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

recipeSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Recipe", recipeSchema);
