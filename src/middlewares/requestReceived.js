const crypto = require("crypto");

const requestReceived = (req, res, next) => {
  req.requestId = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
};

module.exports = requestReceived;
