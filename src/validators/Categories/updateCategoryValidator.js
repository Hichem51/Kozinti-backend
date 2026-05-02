const { body } = require("express-validator");

module.exports = [
  body("name")
    .required()
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty")
    .isLength({ max: 80 })
    .withMessage("Category name cannot exceed 80 characters"),

];
