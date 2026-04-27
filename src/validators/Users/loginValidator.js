const { body } = require("express-validator");

module.exports = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];
