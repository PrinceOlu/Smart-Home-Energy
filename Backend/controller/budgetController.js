const budgetModel = require("../models/budgetModel");
const userModel = require("../models/userModel");

// Create a new budget
const createBudget = async (req, res) => {
    try {
        const { userId, budget, period, energyUsage, alerts } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newBudget = new budgetModel({ userId, budget, period, energyUsage, alerts });
        await newBudget.save();
        res.status(201).json({ message: "Budget created successfully", budget: newBudget });
    } catch (error) {
        res.status(500).json({ message: "Failed to create budget", error });
    }
};

// Get all budgets for a specific user
const getAllBudgetsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const budgets = await budgetModel.find({ userId });
        res.status(200).json({ budgets });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch budgets", error });
    }
};    
// get a specific budget by ID for a specific user    
const getBudgetById = async (req, res) => {
    try {
        const { userId, budgetId } = req.params;
        const budget = await budgetModel.findOne({ _id: budgetId, userId });
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.status(200).json({ budget });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch budget", error });
    }       
}  

// update a specific budget by ID for a specific user
const updateBudgetById = async (req, res) => {
    try {
        const { userId, budgetId } = req.params;
        const { budget, period, energyUsage, alerts } = req.body;
        const updatedBudget = await budgetModel.findOneAndUpdate(
            { _id: budgetId, userId },
            { budget, period, energyUsage, alerts },
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

// delete a specific budget by ID for a specific user
const deleteBudgetById = async (req, res) => {
    try {    
        const { userId, budgetId } = req.params;
        const deletedBudget = await budgetModel.findOneAndDelete({ _id: budgetId, userId });
        if (!deletedBudget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.status(200).json({ message: "Budget deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete budget", error });
    }
};

// fetch energy usage for a specific budget
const fetchEnergyUsage = async (req, res) => {
    try {
        const { userId, budgetId } = req.params;
        const budget = await budgetModel.findOne({ _id: budgetId, userId });
        if (!budget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.status(200).json({ energyUsage: budget.energyUsage });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch energy usage", error });
    }       
}

// update energy usage for a specific budget
const updateEnergyUsage = async (req, res) => {
    try {
        const { userId, budgetId } = req.params;
        const { energyUsage } = req.body;
        if(energyUsage < 0){
            return res.status(400).json({ message: "Energy usage cannot be negative" });        
        }
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

module.exports = {
    createBudget,
    getAllBudgetsByUser,
    updateBudgetById,
    deleteBudgetById,
    getBudgetById,
    fetchEnergyUsage,
    updateEnergyUsage
}