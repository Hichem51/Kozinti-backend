const express = require("express");
const ingredientController = require("../controllers/ingredientController");
const validate = require("../middlewares/validate");
const createIngredientValidator = require("../validators/Ingredients/createIngredientValidator");

const router = express.Router();

router.get("/", ingredientController.listIngredients);
router.post("/", createIngredientValidator, validate, ingredientController.createIngredient);
router.delete("/:id", ingredientController.deleteIngredient);
module.exports = router;
