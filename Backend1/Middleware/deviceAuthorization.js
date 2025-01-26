const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to verify the user's authentication via token
const deviceAuthorization = (req, res, next) => {
    try {
        // Extract the token from cookies
        const token = req.cookies.auth_token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: Token is missing" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user info to the request
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
    }
};

// Middleware to check if the authenticated user matches the userId in the route
const userDeviseAuthentication = async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Ensure the user ID in the token matches the requested user ID
        if (req.user.id !== userId) {
            return res.status(403).json({ message: "Forbidden: Access denied" });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { deviceAuthorization, userDeviseAuthentication };
