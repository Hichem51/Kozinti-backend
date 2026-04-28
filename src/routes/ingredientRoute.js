const express = require("express");
const ingredientController = require("../controllers/ingredientController");
const validate = require("../middlewares/validate");
const createIngredientValidator = require("../validators/Ingredients/createIngredientValidator");
const verifyToken = require("../middlewares/verifyToken");
const authorizeRoles = require("../middlewares/authorizeRoles");

const router = express.Router();

router.get("/", ingredientController.listIngredients);

router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  createIngredientValidator,
  validate,
  ingredientController.createIngredient
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  ingredientController.deleteIngredient
);

module.exports = router;