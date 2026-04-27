const env = require("../config/env");

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  const response = {
    success: false,
    message: error.message || "Internal server error",
    requestId: req.requestId,
  };

  if (error.details) {
    response.errors = error.details;
  }

  if (env.nodeEnv !== "production") {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
