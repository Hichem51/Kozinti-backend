const { body } = require("express-validator");

module.exports = [body("recipe_id").notEmpty().withMessage("Recipe id is required").isMongoId().withMessage("Recipe id must be valid")];
