const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  chef_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
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
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium",
  },
  prep_time: {
    type: Number,
    min: 0,
    hours: 0,
  },
  total_time: {
    type: Number,
    min: 0,
    hours: 0,
  },

  portions: {
    type: Number,
    enum: [1, 2, 4, 6, 8, 10],
    default: 1,
  },
  Nutritional_values: {
    calories: {
      type: Number,
      required: true,
    },
    proteins: {
      type: Number,
      required: true,
    },
    Fats: {
      type: Number,
      required: true,
    },
    Carbohydrates: {
      type: Number,
      required: true,
    },
    Fibers: {
      type: Number,
      required: true,
    },
    Calories: {
      type: Number,
      required: true,
    },

  },
  Reviews: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

recipeSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Recipe", recipeSchema);
