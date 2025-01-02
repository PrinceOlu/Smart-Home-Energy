require('dotenv').config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const dbConfig = require("./config/dbConfig");
const userRouter = require("./routes/userRoute");
const deviceRouter = require("./routes/deviceRoutes");
const budgetRoute = require('./routes/budgetRoutes');
const alertRoute = require('./routes/alertRoute');
const cookieParser = require('cookie-parser');

const app = express(); // Initialize Express app

// Define the port
const port = process.env.PORT || 5000;

// Database connection
dbConfig();

// Define CORS options
const corsOptions = {
    origin: ['http://localhost:5173'], // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow credentials (cookies)
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

// Middleware to parse JSON requests and cookies
app.use(express.json());
app.use(cookieParser());

// User routes with a base path
app.use("/api/users", userRouter);

// Device routes
app.use("/api/devices", deviceRouter);

// Budget routes
app.use("/api/budgets", budgetRoute);

// Alert routes
app.use("/api/alerts", alertRoute);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
