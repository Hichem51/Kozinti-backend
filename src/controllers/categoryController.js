const Category = require("../models/Category");
const createError = require("../utils/createError");

class CategoryController {
  constructor() {
    this.listCategories = this.listCategories.bind(this);
    this.getCategory = this.getCategory.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  normalizeError(error) {
    if (error.statusCode) return error;

    if (error.name === "ValidationError") {
      return createError(400, error.message);
    }

    if (error.code === 11000) {
      return createError(409, "Category already exists");
    }

    return error;
  }

  async listCategories(req, res, next) {
    try {
      const categories = await Category.find().sort({ name: 1 });

      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async getCategory(req, res, next) {
    try {
      const { id } = req.params;

      const category = await Category.findById(id);

      if (!category) {
        return next(createError(404, "Category not found"));
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async createCategory(req, res, next) {
    try {
      const { name } = req.body;

      if (!name) {
        return next(createError(400, "Name is required"));
      }

      const existing = await Category.findOne({ name });
      if (existing) {
        return next(createError(409, "Category already exists"));
      }

      const category = await Category.create({ name });
      res.status(201).json({
        success: true,
        message: "Category created",
        data: category,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return next(createError(400, "Name is required"));
      }

      const category = await Category.findByIdAndUpdate(
        id,
        { name },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!category) {
        return next(createError(404, "Category not found"));
      }

      res.status(200).json({
        success: true,
        message: "Category updated",
        data: category,
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;

      const category = await Category.findByIdAndDelete(id);

      if (!category) {
        return next(createError(404, "Category not found"));
      }

      res.status(200).json({
        success: true,
        message: "Category deleted",
      });
    } catch (error) {
      next(this.normalizeError(error));
    }
  }
}

module.exports = new CategoryController();
