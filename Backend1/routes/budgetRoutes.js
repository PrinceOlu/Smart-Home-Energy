const express = require("express");
const router = express.Router();
const {
    createBudget,
    getAllBudgetsByUser,
    getBudgetById,
    updateBudgetById,
    deleteBudgetById,
    fetchEnergyUsage,
    updateEnergyUsage,
    aggregateEnergyUsage
} = require("../controller/budgetController");
// const userAuthentication = require("../Middleware/userAuthentication");

// Create a new budget
router.post("/create",  createBudget);

// Get all budgets for a specific user
router.get("/:userId",  getAllBudgetsByUser);

// Get a specific budget by ID
router.get("/:userId/:budgetId",  getBudgetById);

// Update a specific budget by ID
router.put("/:userId/:budgetId",  updateBudgetById);

// Delete a specific budget by ID
router.delete("/:userId/:budgetId",  deleteBudgetById);

// Fetch energy usage for a specific budget
router.get("/:userId/:budgetId/energy-usage",  fetchEnergyUsage);

// Update energy usage for a specific budget
router.put("/:userId/:budgetId/energy-usage",  updateEnergyUsage);

// route to aggregate energy usage
router.put("/:userId/:budgetId/aggregate-usage", aggregateEnergyUsage);

module.exports = router;
