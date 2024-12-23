const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authenticateUser = require("../Middleware/authenticateUser");

// User routes to register a new user (does not require authentication)
router.post("/register", userController.registerUser);

// User routes to login a user (does not require authentication)
router.post("/login", userController.loginUser);

// User routes to logout a user (requires authentication)
router.post("/logout", authenticateUser, userController.logoutUser);

module.exports = router;
