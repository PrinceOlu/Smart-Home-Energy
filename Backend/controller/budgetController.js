const { request } = require("express");
const budgetModel = require("../models/budgetModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const Device = require("../models/deviceModel");
// const { sendAlertNotification } = require("./notifications"); // Assuming you have a function to send alerts

// Create a new budget
const createBudget = async (req, res) => {
    try {
        const { userId, energyLimit, period, alerts, energyUsage } = req.body;

        // Input validation
        if (!userId || !energyLimit || !period) {
            return res.status(400).json({
                message: "Missing required fields",
                details: {
                    userId: !userId ? "User ID is required" : null,
                    energyLimit: !energyLimit ? "Energy limit is required" : null,
                    period: !period ? "Period is required" : null
                }
            });
        }

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID format"
            });
        }

        // Validate numeric fields
        if (isNaN(Number(energyLimit)) || Number(energyLimit) <= 0) {
            return res.status(400).json({
                message: "Energy limit must be a positive number"
            });
        }

        // Validate user existence
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                details: "The specified user ID does not exist"
            });
        }

        // Parse alerts value properly
        const alertsValue = typeof alerts === 'string' 
            ? alerts.toLowerCase() === 'true'
            : Boolean(alerts);

        // Create budget with validated data
        const newBudget = new budgetModel({
            userId,
            energyLimit: Number(energyLimit),
            period: period.trim(),
            alerts: alertsValue,  // Using the properly parsed boolean value
            energyUsage: energyUsage || 0,
        });

        // Save the budget
        const savedBudget = await newBudget.save();

        // Return success response
        return res.status(201).json({
            message: "Budget created successfully",
            budget: savedBudget
        });

    } catch (error) {
        // Log the error for debugging
        console.error('Budget creation error:', error);

        // Check for specific MongoDB errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                details: Object.values(error.errors).map(err => err.message)
            });
        }

        if (error.name === 'MongoServerError' && error.code === 11000) {
            return res.status(409).json({
                message: "Duplicate budget entry",
                details: "A budget for this period already exists"
            });
        }

        // Generic error response
        return res.status(500).json({
            message: "Failed to create budget",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get all budgets for a specific user
const getAllBudgetsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch all budgets associated with the user
        const budgets = await budgetModel.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ budgets });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch budgets", error });
    }
};

// Get a specific budget by ID for a specific user
const getBudgetById = async (req, res) => {
    try {
        const { userId, budgetId } = req.params;

        // Fetch budget by ID and user
        const budget = await budgetModel.findOne({ _id: budgetId, userId });
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.status(200).json({ budget });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch budget", error });
    }
};

// Update a specific budget by ID for a specific user
const updateBudgetById = async (req, res) => {
    try {
        const { userId, budgetId } = req.params;
        const { energyLimit, period, alerts, energyUsage } = req.body;

        // Validate and update budget
        const updatedBudget = await budgetModel.findOneAndUpdate(
            { _id: budgetId, userId },
            { energyLimit, period, alerts, energyUsage },
            { new: true }
        );
        if (!updatedBudget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.status(200).json({ message: "Budget updated successfully", budget: updatedBudget });
    } catch (error) {
        res.status(500).json({ message: "Failed to update budget", error });
    }
};

// Delete a specific budget by ID for a specific user
const deleteBudgetById = async (req, res) => {
    try {
        const { userId, budgetId } = req.params;

        // Validate and delete budget
        const deletedBudget = await budgetModel.findOneAndDelete({ _id: budgetId, userId });
        if (!deletedBudget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.status(200).json({ message: "Budget deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete budget", error });
    }
};

// Fetch energy usage for a specific budget
const fetchEnergyUsage = async (req, res) => {
    try {
        const { userId, budgetId } = req.params;

        // Retrieve energy usage from budget
        const budget = await budgetModel.findOne({ _id: budgetId, userId });
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.status(200).json({ energyUsage: budget.energyUsage });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch energy usage", error });
    }
};

// Update energy usage for a specific budget
const updateEnergyUsage = async (req, res) => {
    try {
        const { userId, budgetId } = req.params;
        const { energyUsage } = req.body;

        // Validate energy usage
        if (energyUsage < 0) {
            return res.status(400).json({ message: "Energy usage cannot be negative" });
        }

        // Update energy usage in budget
        const updatedBudget = await budgetModel.findOneAndUpdate(
            { _id: budgetId, userId },
            { energyUsage },
            { new: true }
        );
        if (!updatedBudget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.status(200).json({ message: "Energy usage updated successfully", budget: updatedBudget });
    } catch (error) {
        res.status(500).json({ message: "Failed to update energy usage", error });
    }
};

// Calculate and aggregate energy usage for all active budgets
const aggregateEnergyUsage = async (req, res) => {
    try {
        const { userId, budgetId } = req.params;

        // Validation for missing parameters
        if (!userId || !budgetId) {
            return res.status(400).json({ message: "Both userId and budgetId are required." });
        }

        // Step 1: Aggregate energy usage from online devices linked to the user and budget
        const deviceUsage = await Device.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    status: "Online" // Only consider online devices
                }
            },
            {
                $group: {
                    _id: null,
                    totalUsage: { $sum: "$energyUsage" } // Sum up energy usage from all online devices
                }
            }
        ]);

        // Step 2: Calculate total energy usage from devices
        const totalEnergyUsage = deviceUsage.length > 0 ? deviceUsage[0].totalUsage : 0;

        // Step 3: Fetch the active budget to check energy limit
        const budget = await budgetModel.findOne({ _id: budgetId, userId: userId, status: "Active" });
        if (!budget) {
            return res.status(404).json({ message: "Budget not found or inactive." });
        }

        // Step 4: Determine if alerts are needed based on the energy limit
        const hasAlerts = totalEnergyUsage > budget.energyLimit;

        // Step 5: Update the budget with the new energy usage and alert status
        const updatedBudget = await budgetModel.findOneAndUpdate(
            { _id: budgetId, userId: userId, status: "Active" },
            {
                $set: {
                    energyUsage: totalEnergyUsage,
                    hasAlerts: hasAlerts,
                    lastUpdated: new Date()
                }
            },
            { new: true }
        );

        // Step 6: Send an alert notification if the budget limit is exceeded
        if (updatedBudget.hasAlerts) {
            await sendAlertNotification(userId, updatedBudget);
        }

        // Step 7: Return aggregated data to the frontend
        return res.status(200).json({
            message: "Budget usage aggregated successfully.",
            budget: updatedBudget,
            usage: {
                current: totalEnergyUsage,
                limit: updatedBudget.energyLimit,
                percentage: Number(((totalEnergyUsage / updatedBudget.energyLimit) * 100).toFixed(2))
            }
        });

    } catch (error) {
        console.error("Error in aggregateEnergyUsage:", error);
        return res.status(500).json({
            message: "Error aggregating budget usage.",
            error: error.message
        });
    }
};

// Export all functions in one go
module.exports = {
    createBudget,
    getAllBudgetsByUser,
    getBudgetById,
    updateBudgetById,
    deleteBudgetById,
    fetchEnergyUsage,
    updateEnergyUsage,
    aggregateEnergyUsage
};
