const express = require("express");
const authController = require("../controllers/authController");
const validate = require("../middlewares/validate");
const verifyToken = require("../middlewares/verifyToken");
const registerValidator = require("../validators/Users/registerValidator");
const loginValidator = require("../validators/Users/loginValidator");

const router = express.Router();

router.get("/", authController.getAuthStatus);
router.post("/register", registerValidator, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);
router.get("/me", verifyToken, authController.getMe);

module.exports = router;
