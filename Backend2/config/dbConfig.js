const mongoose = require("mongoose");
const dbConfig = async () => {
    try {
        const uri = process.env.MONGO_URL;
        // Check if MONGO_URL is defined
        if (!uri) {
            console.error("MONGO_URL is not defined in the environment variables.");
            process.exit(1); 
        }
        // Connect to MongoDB
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully");

    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); 
    }
};

module.exports = dbConfig;
