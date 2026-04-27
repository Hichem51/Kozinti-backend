const Category = require("../models/Category");

class CategoryController {
  async listCategories(req, res) {
    try {
      const categories = await Category.find().sort({ name: 1 });

      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCategory(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createCategory(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Name is required",
        });
      }

      const existing = await Category.findOne({ name });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Category already exists",
        });
      }

      const category = await Category.create({ name });
      res.status(201).json({
        success: true,
        message: "Category created",
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Name is required",
        });
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
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Category updated",
        data: category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findByIdAndDelete(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Category deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new CategoryController();
