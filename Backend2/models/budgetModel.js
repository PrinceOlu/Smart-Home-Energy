const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        energyLimit: {
            type: Number,
            required: true,
        },
        period: {
            type: String,
            required: true,
            unique: true,
                   },
        energyUsage: {
            type: Number,
            default: 0,
            min: 0,
        },
        alerts: {
            type: Boolean,  // Changed from array of enums to simple boolean
            default: false
        },
        status: {
            type: String,
            enum: ["Active", "Archived"],
            default: "Active",
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
