const { body, param } = require("express-validator");

const createFavoriteValidator = [
  body("recipe_id")
    .notEmpty()
    .withMessage("Recipe id is required")
    .isMongoId()
    .withMessage("Recipe id must be valid"),
];

const deleteFavoriteValidator = [
  param("recipeId").isMongoId().withMessage("Recipe id must be valid"),
];

module.exports = {
  createFavoriteValidator,
  deleteFavoriteValidator,
};
