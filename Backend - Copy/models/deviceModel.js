const mongoose = require("mongoose");

// Define the device schema
const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
   
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["On", "Off"],
        default: "Off",
    },
    powerRating: {
        type: Number,
        required: true,
    },
    energyUsage: {
        type: Number,
        required: true,
        default: 0,
    },
    energyConsumptionHistory: [
        {
            timestamp: {
                type: Date,
                required: true,
            },
            energyConsumed: {
                type: Number,
                required: true,
            },
        }
    ],
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the device model
const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
