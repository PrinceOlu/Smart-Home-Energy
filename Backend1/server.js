require('dotenv').config(); // Load environment variables
const express = require("express"); // Import Express
const app = express(); // Initialize Express app
const dbConfig = require("./config/dbConfig"); // Import database configuration
// Import routes
const userRouter = require("./routes/userRoute");
const deviceRouter = require("./routes/deviceRoutes");
const energyUsageRoute = require("./routes/energyUsageRoute");
const budgetRoute = require('./routes/budgetRoutes');
// Import middleware
const cookieParser = require('cookie-parser'); // Import cookie-parser middleware for handling cookies
const cors = require("cors"); // Import CORS middleware for enabling cross-origin resource sharing

// Define the port
const port = process.env.PORT || 5001;

// Database connection
dbConfig();

// Define CORS options
const corsOptions = {
    origin: ['http://localhost:5173'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
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

// Energy usage routes
app.use("/api/energy-usage", energyUsageRoute);

// Budget routes
app.use("/api/budgets", budgetRoute);


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
