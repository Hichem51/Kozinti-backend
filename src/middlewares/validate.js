const { validationResult } = require("express-validator");
const createError = require("../utils/createError");

const validate = (req, res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array().map((error) => ({
    field: error.path,
    message: error.msg,
    value: error.value,
  }));

  return next(createError(400, "Validation failed", errors));
};

module.exports = validate;
