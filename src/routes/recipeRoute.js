const express = require("express");
const recipeController = require("../controllers/recipeController");
const validate = require("../middlewares/validate");
const createRecipeValidator = require("../validators/Recipes/createRecipeValidator");
const updateRecipeValidator = require("../validators/Recipes/updateRecipeValidator");
const recipeIdValidator = require("../validators/Recipes/recipeIdValidator");

const router = express.Router();

router.get("/", recipeController.listRecipes);
router.get("/:id", recipeIdValidator, validate, recipeController.getRecipeById);
router.post("/", createRecipeValidator, validate, recipeController.createRecipe);
router.patch("/:id", recipeIdValidator, updateRecipeValidator, validate, recipeController.updateRecipe);
router.delete("/:id", recipeIdValidator, validate, recipeController.deleteRecipe);

module.exports = router;
