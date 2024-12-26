const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        budget: {
            type: Number,
            required: true,
        },
        period: {
            type: String,
            enum: ["Daily", "Weekly", "Monthly", "Yearly"],
        },
        energyUsage: {
            type: Number,
            required: true,
            default: 0,
        },
        alerts: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
