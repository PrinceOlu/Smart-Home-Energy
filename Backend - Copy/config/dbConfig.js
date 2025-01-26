const mongoose = require("mongoose");
const dbConfig = async () => {
    try {
        const uri = process.env.MONGO_URL;
        if (!uri) {
            console.error("MONGO_URL is not defined in the environment variables.");
            process.exit(1); // Exit the process to prevent app from starting
        }

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = dbConfig;
