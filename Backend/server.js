require('dotenv').config(); // Load environment variables at the start
const express = require("express");
const cors = require("cors");
const dbConfig = require("./config/dbConfig");
const userRouter = require("./routes/userRoute");
const deviceRouter = require("./routes/deviceRoutes");
const cookieParser = require('cookie-parser');
const budgetRoute = require('./routes/budgetRoutes');
const alertRoute = require('./routes/alertRoute');
const app = express(); // Initialize Express app
// Define the port
const port = process.env.PORT || 5000;
// Database connection
dbConfig();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// user routes with a base path
app.use("/api/users", userRouter);
// Device routes
app.use("/api/devices", deviceRouter);
// budget routes
app.use("/api/budgets", budgetRoute);
// alert routes
app.use("/api/alerts", alertRoute);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
