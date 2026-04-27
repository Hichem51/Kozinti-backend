const express = require("express");
const categoryController = require("../controllers/categoryController");
const validate = require("../middlewares/validate");
const createCategoryValidator = require("../validators/Categories/createCategoryValidator");

const router = express.Router();

router.get("/", categoryController.listCategories);
router.post("/", createCategoryValidator, validate, categoryController.createCategory);

module.exports = router;
