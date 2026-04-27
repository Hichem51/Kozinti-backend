const listCategories = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Category list endpoint scaffolded",
    data: {
      categories: [],
    },
  });
};

const createCategory = (req, res) => {
  res.status(501).json({
    success: false,
    message: "Create category endpoint scaffolded. Database write logic will be implemented next.",
    data: {
      accepted_fields: ["name", "slug"],
    },
  });
};

module.exports = {
  listCategories,
  createCategory,
};
