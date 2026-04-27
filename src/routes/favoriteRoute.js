const express = require("express");
const favoriteController = require("../controllers/favoriteController");
const validate = require("../middlewares/validate");
const favoriteValidator = require("../validators/Favorites/favoriteValidator");

const router = express.Router();

router.get("/", favoriteController.listFavorites);
router.post("/", favoriteValidator, validate, favoriteController.addFavorite);
router.delete("/:recipeId", favoriteController.removeFavorite);

module.exports = router;
