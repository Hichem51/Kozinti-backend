const createError = require("../utils/createError");

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(401, "Authentication is required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(createError(403, "You do not have permission to access this resource"));
    }

    return next();
  };
};

module.exports = authorizeRoles;
