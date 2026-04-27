const { body } = require("express-validator");

module.exports = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 140 })
    .withMessage("Title must be between 1 and 140 characters"),
  body("description").optional().trim().isLength({ max: 3000 }).withMessage("Description is too long"),
  body("image_url").optional({ checkFalsy: true }).trim().isURL().withMessage("Image URL must be valid"),
];