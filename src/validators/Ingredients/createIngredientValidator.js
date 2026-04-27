const { body } = require("express-validator");

module.exports = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Ingredient name is required")
    .isLength({ max: 100 })
    .withMessage("Ingredient name cannot exceed 100 characters"),
  body("unit").optional().trim().isLength({ max: 40 }).withMessage("Unit cannot exceed 40 characters"),
];
