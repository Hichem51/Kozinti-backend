const listRecipes = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Recipe list endpoint scaffolded",
    data: {
      recipes: [],
    },
  });
};

const getRecipeById = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Recipe detail endpoint scaffolded",
    data: {
      recipe: null,
      requested_id: req.params.id,
    },
  });
};

const createRecipe = (req, res) => {
  res.status(501).json({
    success: false,
    message: "Create recipe endpoint scaffolded. Database write logic will be implemented next.",
    data: {
      accepted_fields: ["chef_id", "title", "description", "image_url"],
    },
  });
};

const updateRecipe = (req, res) => {
  res.status(501).json({
    success: false,
    message: "Update recipe endpoint scaffolded. Database update logic will be implemented next.",
    data: {
      requested_id: req.params.id,
    },
  });
};

module.exports = {
  listRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
};
