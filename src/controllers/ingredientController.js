const listIngredients = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Ingredient list endpoint scaffolded",
    data: {
      ingredients: [],
    },
  });
};

const createIngredient = (req, res) => {
  res.status(501).json({
    success: false,
    message: "Create ingredient endpoint scaffolded. Database write logic will be implemented next.",
    data: {
      accepted_fields: ["name", "unit"],
    },
  });
};

module.exports = {
  listIngredients,
  createIngredient,
};
