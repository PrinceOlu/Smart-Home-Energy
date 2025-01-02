const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const userAuthentication = require("../Middleware/userAuthentication");

// Public routes (no authentication required)
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Protected routes (authentication required)
router.delete("/logout", userAuthentication, userController.logoutUser);

module.exports = router;
