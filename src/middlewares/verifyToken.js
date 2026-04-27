const createError = require("../utils/createError");
const { verifyTokenValue } = require("../utils/jwt");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  const token = bearerToken || req.cookies.token;

  if (!token) {
    return next(createError(401, "Authentication token is required"));
  }

  try {
    req.user = verifyTokenValue(token);
    return next();
  } catch (error) {
    return next(createError(401, "Invalid or expired authentication token"));
  }
};

module.exports = verifyToken;
