const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const userAuthentication = require("../Middleware/userAuthentication");

// User routes to register a new user (does not require authentication)
router.post("/register", userController.registerUser);

// User routes to login a user (does not require authentication)
router.post("/login", userController.loginUser);

// User routes to logout a user (requires authentication)
router.post("/logout", userAuthentication, userController.logoutUser);

module.exports = router;
