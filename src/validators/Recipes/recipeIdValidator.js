const { param } = require("express-validator");

module.exports = [param("id").isMongoId().withMessage("Recipe id must be a valid MongoDB id")];
