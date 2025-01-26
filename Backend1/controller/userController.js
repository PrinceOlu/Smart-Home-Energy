const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../utils/redisClient");

// Common cookie configuration
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensures secure cookies are only sent over HTTPS in production
    // Do not use maxAge in clearCookie
};

// Function to register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: error.message });
    }
};

// Function to login a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const redisKey = `user:${email}`;

        // Check Redis cache for user data
        const cachedUserData = await redisClient.get(redisKey);
        if (cachedUserData) {
            console.log(`Cache hit for user: ${email}`);
            const cachedUser = JSON.parse(cachedUserData);

            // Generate JWT
            const token = jwt.sign({ userId: cachedUser.userId }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION || "1h",
            });

            // Set the token in an HTTP-only cookie
            res.cookie("auth_token", token, cookieOptions);

            // Return only userId
            return res.status(200).json({
                message: "User logged in successfully (from cache)",
                userId: cachedUser.userId,
            });
        }

        // Fetch user from the database
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT and cache necessary user data
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION || "24h",
        });

        const cacheUserData = { userId: user._id, email: user.email };
        await redisClient.setex(redisKey, 3600, JSON.stringify(cacheUserData));

        // Set the token in an HTTP-only cookie
        res.cookie("auth_token", token, cookieOptions);

        // Return only userId
        res.status(200).json({
            message: "User logged in successfully",
            userId: user._id,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Function to logout a user
const logoutUser = async (req, res) => {
    try {
        const token = req.cookies.auth_token;
        if (!token) {
            // Clear any residual cookies even if token is not present
            res.clearCookie("auth_token", { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            return res.status(200).json({ message: "User logged out successfully" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                // Token expired: Clear cookies and return success
                res.clearCookie("auth_token", { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                return res.status(200).json({ message: "User logged out successfully" });
            }
            throw err; // Other JWT errors
        }

        const { userId } = decoded; // Use userId for cache invalidation
        const redisKey = `user:${userId}`;

        // Clear the auth_token cookie without using maxAge (as maxAge is deprecated)
        res.clearCookie("auth_token", {
            httpOnly: true, // Optional, if you still want to keep it
            secure: process.env.NODE_ENV === 'production' // Optional, for HTTPS only
        });

        // Invalidate Redis cache
        const cacheResult = await redisClient.del(redisKey);
        if (cacheResult === 1) {
            console.log(`Cache invalidated for ${redisKey}`);
        }

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { registerUser, loginUser, logoutUser };
