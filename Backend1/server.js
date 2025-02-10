require('dotenv').config(); // Load environment variables
const express = require("express"); // Import Express
const path = require("path"); // Import Path module
const cookieParser = require("cookie-parser"); // Middleware for handling cookies
const cors = require("cors"); // Middleware for cross-origin resource sharing

const dbConfig = require("./config/dbConfig"); // Import database configuration
const userRouter = require("./routes/userRoute"); // User routes
const deviceRouter = require("./routes/deviceRoutes"); // Device routes
const energyUsageRoute = require("./routes/energyUsageRoute"); // Energy usage routes
const budgetRoute = require("./routes/budgetRoutes"); // Budget routes

const app = express(); // Initialize Express app

// Database connection
dbConfig();

// Define CORS options
const corsOptions = {
    origin: ['http://localhost:5173','http://http://18.191.40.152'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
};

// Apply middleware
app.use(cors(corsOptions)); // Enable CORS
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies

// API routes
app.use("/api/users", userRouter);
app.use("/api/devices", deviceRouter);
app.use("/api/energy-usage", energyUsageRoute);
app.use("/api/budgets", budgetRoute);

// Serve static frontend files
// const buildPath = path.join(__dirname, "../frontend/dist"); // Adjusted path
// app.use(express.static(buildPath));

// // Handle React routing for all other requests
// app.get("*", (req, res) => {
//     res.sendFile(path.join(buildPath, "index.html"));
// });

// Define the port
const port = process.env.PORT || 5001;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
