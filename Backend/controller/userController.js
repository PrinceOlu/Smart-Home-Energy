const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../utils/redisClient"); // Import Redis client

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

        // First, check if user data is cached in Redis
        const cachedUser = await redisClient.get(email);

        if (cachedUser) {
            // Cache hit: Return the cached data
            console.log('Cache hit for user:', email);
            const user = JSON.parse(cachedUser);
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.cookie('auth_token', token, {
                httpOnly: true,   // Cannot be accessed by JavaScript (safer)
                secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
                maxAge: 3600000,  // Cookie expires in 1 hour (same as JWT expiration)
            });

            return res.status(200).json({
                message: "User logged in successfully (from cache)",
                token: token,
            });
        }

        // Cache miss: User data not found in Redis, so fetch from the database
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Cache the user data in Redis for 1 hour (expire time = 3600 seconds)
        await redisClient.setex(email, 3600, JSON.stringify(user));

        // Send the token in an HTTP-only cookie
        res.cookie('auth_token', token, {
            httpOnly: true,   // Cannot be accessed by JavaScript (safer)
            secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
            maxAge: 3600000,  // Cookie expires in 1 hour (same as JWT expiration)
        });

        res.status(200).json({
            message: "User logged in successfully",
            token: token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Function to logout a user
const logoutUser = (req, res) => {
    const { email } = req.body; // Assuming email is passed in the request body

    // Clear the auth_token cookie
    res.clearCookie('auth_token');

    // Invalidate the cached user data in Redis
    redisClient.del(email, (err, response) => {
        if (err) {
            console.error('Error invalidating cache:', err);
        } else {
            console.log(`Cache invalidated for ${email}`);
        }
    });

    res.status(200).json({ message: "User logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser };
