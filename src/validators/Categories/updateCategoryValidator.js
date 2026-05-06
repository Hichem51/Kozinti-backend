const { body } = require("express-validator");

module.exports = [
  body("name")
    .exists()
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ max: 80 })
    .withMessage("Category name cannot exceed 80 characters"),

];
