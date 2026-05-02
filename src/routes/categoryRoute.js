const express = require("express");
const categoryController = require("../controllers/categoryController");
const validate = require("../middlewares/validate");
const verifyToken = require("../middlewares/verifyToken");
const authorizeRoles = require("../middlewares/authorizeRoles");

const categoryIdValidator = require("../validators/Categories/categoryIdValidator");
const createCategoryValidator = require("../validators/Categories/createCategoryValidator");
const updateCategoryValidator = require("../validators/Categories/updateCategoryValidator");

const router = express.Router();

// Public
router.get("/", categoryController.listCategories);
router.get("/:id", categoryIdValidator, validate, categoryController.getCategory);

// Admin only
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  createCategoryValidator,
  validate,
  categoryController.createCategory
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  categoryIdValidator,
  updateCategoryValidator,
  validate,
  categoryController.updateCategory
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  categoryIdValidator,
  validate,
  categoryController.deleteCategory
);

module.exports = router;
