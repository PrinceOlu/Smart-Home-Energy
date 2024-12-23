require('dotenv').config(); // Load environment variables at the start
const express = require("express");
const cors = require("cors");
const dbConfig = require("./config/dbConfig");
const userRouter = require("./routes/userRoute");

const app = express(); // Initialize Express app
// Define the port
const port = process.env.PORT || 5000;
// Database connection
dbConfig();

// Middlewares
app.use(cors());
app.use(express.json());

// user routes with a base path
app.use("/api/users", userRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
