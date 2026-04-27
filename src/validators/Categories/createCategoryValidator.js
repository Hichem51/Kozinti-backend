const { body } = require("express-validator");

module.exports = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ max: 80 })
    .withMessage("Category name cannot exceed 80 characters"),
  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Category slug is required")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Category slug must use lowercase letters, numbers, and hyphens"),
];
