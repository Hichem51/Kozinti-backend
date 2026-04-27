const express = require("express");
const categoryController = require("../controllers/categoryController");
const validate = require("../middlewares/validate");
const verifyToken = require("../middlewares/verifyToken");

const createCategoryValidator = require("../validators/Categories/createCategoryValidator");
const updateCategoryValidator = require("../validators/Categories/updateCategoryValidator");

const router = express.Router();


router.get("/", categoryController.listCategories);
router.get("/:id", categoryController.getCategory);

router.post(
  "/",
  verifyToken,
  createCategoryValidator,
  validate,
  categoryController.createCategory
);

router.put(
  "/:id",
  verifyToken,
  updateCategoryValidator,
  validate,
  categoryController.updateCategory
);

router.delete(
  "/:id",
  verifyToken,
  categoryController.deleteCategory
);

module.exports = router;