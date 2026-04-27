const { param } = require("express-validator");

module.exports = [param("id").isMongoId().withMessage("Category id must be a valid MongoDB id")];
