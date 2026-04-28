const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const env = require("./src/config/env");
const connectDB = require("./src/config/db");
const createError = require("./src/utils/createError");
const requestReceived = require("./src/middlewares/requestReceived");
const errorHandler = require("./src/middlewares/errorHandler");

const authRoute = require("./src/routes/authRoute");
const recipeRoute = require("./src/routes/recipeRoute");
const categoryRoute = require("./src/routes/categoryRoute");
const ingredientRoute = require("./src/routes/ingredientRoute");
const favoriteRoute = require("./src/routes/favoriteRoute");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(requestReceived);

app.get("/", (req, res) => {
  res.render("home", {
    title: "Recipe Backend",
    baseUrl: "/",
    endpoints: [
      { method: "GET", path: "/health", description: "Server health check" },
      { method: "POST", path: "/users/register", description: "Register a new user" },
      { method: "POST", path: "/users/login", description: "Login a user" },
      { method: "GET", path: "/users/me", description: "Get the current user from a token" },
      { method: "GET", path: "/recipes", description: "List recipes scaffold" },
      { method: "GET", path: "/categories", description: "List categories scaffold" },
      { method: "GET", path: "/ingredients", description: "List ingredients scaffold" },
      { method: "GET", path: "/favorites", description: "List the authenticated user's favorites" },
    ],
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Recipe API is healthy",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.use("/users", authRoute);
app.use("/recipes", recipeRoute);
app.use("/categories", categoryRoute);
app.use("/ingredients", ingredientRoute);
app.use("/favorites", favoriteRoute);

app.use((req, res, next) => {
  next(createError(404, `Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`[server] Recipe backend running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error(`[server] Startup failed: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
