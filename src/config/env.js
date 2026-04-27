const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(process.cwd(), ".env"), quiet: true });

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

module.exports = {
  port: toNumber(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI,
  mongoServerSelectionTimeoutMS: toNumber(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS, 5000),
  jwtSecret: process.env.JWT_SECRET || "recipe_backend_dev_secret_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  skipDbConnect: process.env.SKIP_DB_CONNECT === "true",
};
