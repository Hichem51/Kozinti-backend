const { body } = require("express-validator");

module.exports = [
  body("chef_id").optional().isMongoId().withMessage("Chef id must be a valid MongoDB id"),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 140 })
    .withMessage("Title cannot exceed 140 characters"),
  body("description").optional().trim().isLength({ max: 3000 }).withMessage("Description is too long"),
  body("image_url").optional({ checkFalsy: true }).trim().isURL().withMessage("Image URL must be valid"),
];
