const listFavorites = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Favorite list endpoint scaffolded",
    data: {
      favorites: [],
    },
  });
};

const addFavorite = (req, res) => {
  res.status(501).json({
    success: false,
    message: "Add favorite endpoint scaffolded. Auth and database write logic will be implemented next.",
    data: {
      accepted_fields: ["recipe_id"],
    },
  });
};

const removeFavorite = (req, res) => {
  res.status(501).json({
    success: false,
    message: "Remove favorite endpoint scaffolded. Auth and database delete logic will be implemented next.",
    data: {
      requested_recipe_id: req.params.recipeId,
    },
  });
};

module.exports = {
  listFavorites,
  addFavorite,
  removeFavorite,
};
