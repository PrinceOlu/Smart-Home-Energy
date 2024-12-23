const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Function to register a new user
const registerUser = async (req, res) => {
    try {
        // Destructure the request body
        const { name, email, password } = req.body;
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const user = new userModel({ name, email, password: hashedPassword });
        // Save the user
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: "Email already exists" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

// Function to login a user
const loginUser = async (req, res) => {
    try {
        // Destructure the request body
        const { email, password } = req.body;
        // Find the user by email
        const user = await userModel.findOne({ email });
        // Check if the user exists
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        // Send the token in an HTTP-only cookie
        res.cookie('auth_token', token, {
            httpOnly: true,   // Cannot be accessed by JavaScript (safer)
            secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
            maxAge: 3600000,  // Cookie expires in 1 hour (same as JWT expiration)
        });
        res.status(200).json(
            {
             "Token"  :  token,
            "message": "User logged in successfully" 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};  

// function to logout a user
const logoutUser = (req, res) => {
     // Clear the auth_token cookie
     res.clearCookie('auth_token');
    res.status(200).json({ message: "User logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser };