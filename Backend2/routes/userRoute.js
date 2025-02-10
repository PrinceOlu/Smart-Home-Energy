const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, getProfile } = require("../controller/userController");
const userAuthentication = require("../Middleware/userAuthentication");

// Public routes (no authentication required)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (authentication required)
router.get("/profile/:userId", getProfile);
router.delete("/logout", userAuthentication, logoutUser);

module.exports = router;
