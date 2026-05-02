const { body } = require("express-validator");

const allowedDifficultyValues = ["Easy", "Medium", "Hard"];
const allowedPortionValues = [1, 2, 4, 6, 8, 10];

const nutritionalValueValidator = (field) =>
  body(`Nutritional_values.${field}`)
    .notEmpty()
    .withMessage(`${field} is required`)
    .isFloat({ min: 0 })
    .withMessage(`${field} must be a positive number`);

module.exports = [
  body("category_id")
    .notEmpty()
    .withMessage("Category id is required")
    .isMongoId()
    .withMessage("Category id must be a valid MongoDB id"),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 140 })
    .withMessage("Title cannot exceed 140 characters"),
  body("description").optional().trim().isLength({ max: 3000 }).withMessage("Description is too long"),
  body("image_url").optional({ checkFalsy: true }).trim().isURL().withMessage("Image URL must be valid"),
  body("difficulty")
    .optional()
    .isIn(allowedDifficultyValues)
    .withMessage("Difficulty must be Easy, Medium, or Hard"),
  body("prep_time").optional().isFloat({ min: 0 }).withMessage("Prep time must be a positive number"),
  body("total_time").optional().isFloat({ min: 0 }).withMessage("Total time must be a positive number"),
  body("portions")
    .optional()
    .custom((value) => allowedPortionValues.includes(Number(value)))
    .withMessage("Portions must be one of 1, 2, 4, 6, 8, or 10"),
  body("Nutritional_values").isObject().withMessage("Nutritional values are required"),
  nutritionalValueValidator("calories"),
  nutritionalValueValidator("proteins"),
  nutritionalValueValidator("Fats"),
  nutritionalValueValidator("Carbohydrates"),
  nutritionalValueValidator("Fibers"),
  body("Reviews").optional().isArray().withMessage("Reviews must be an array"),
  body("Reviews.*.user_id").optional().isMongoId().withMessage("Review user id must be a valid MongoDB id"),
  body("Reviews.*.rating").optional().isInt({ min: 1, max: 5 }).withMessage("Review rating must be between 1 and 5"),
  body("ingredients").optional().isArray().withMessage("Ingredients must be an array"),
  body("ingredients.*.ingredient_id")
    .optional()
    .isMongoId()
    .withMessage("Ingredient id must be a valid MongoDB id"),
  body("ingredients.*.quantity")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Ingredient quantity is required"),
  body("ingredients.*.notes").optional().trim().isLength({ max: 500 }).withMessage("Ingredient notes are too long"),
];
