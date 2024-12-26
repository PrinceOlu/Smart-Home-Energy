const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../utils/redisClient");

// Common cookie configuration
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000, // 1 hour in milliseconds
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
        const redisKey = `user:${email}`; // Updated Redis key format

        // Check Redis cache
        const cachedUser = await redisClient.get(redisKey);
        if (cachedUser) {
            console.log("Cache hit for user:", email);
            const user = JSON.parse(cachedUser);
            const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.cookie("auth_token", token, cookieOptions);
            return res.status(200).json({ message: "User logged in successfully (from cache)", token });
        }

        // Fetch user from database
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT and cache user data
        const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        await redisClient.setex(redisKey, 3600, JSON.stringify(user)); // Use the updated key format

        res.cookie("auth_token", token, cookieOptions);
        res.status(200).json({ message: "User logged in successfully", token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: error.message });
    }
};

// Function to logout a user
const logoutUser = async (req, res) => {
    try {
        const token = req.cookies.auth_token;
        if (!token) {
            return res.status(400).json({ message: "User not logged in" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded;

        if (!email) {
            return res.status(400).json({ message: "Email not found in token" });
        }

        const redisKey = `user:${email}`; // Updated Redis key format

        // Clear the auth_token cookie and invalidate cache
        res.clearCookie("auth_token");
        const cacheResult = await redisClient.del(redisKey); // Use the updated key format
        if (cacheResult === 1) {
            console.log(`Cache invalidated for ${redisKey}`);
        } else {
            console.warn(`No cache found for ${redisKey}`);
        }

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registerUser, loginUser, logoutUser };
