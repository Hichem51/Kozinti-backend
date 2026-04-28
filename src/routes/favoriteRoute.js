const express = require("express");
const favoriteController = require("../controllers/favoriteController");
const validate = require("../middlewares/validate");
const verifyToken = require("../middlewares/verifyToken");
const favoriteValidator = require("../validators/Favorites/favoriteValidator");

const router = express.Router();

router.use(verifyToken);

router.get("/", favoriteController.listFavorites);
router.post("/", favoriteValidator.createFavoriteValidator, validate, favoriteController.addFavorite);
router.delete("/:recipeId", favoriteValidator.deleteFavoriteValidator, validate, favoriteController.removeFavorite);

module.exports = router;
