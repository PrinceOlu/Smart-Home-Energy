const express = require("express"); 
const router = express.Router();
const { createBudget, getAllBudgetsByUser, updateBudgetById, deleteBudgetById, getBudgetById, fetchEnergyUsage, updateEnergyUsage } = require("../controller/budgetController");
const userAuthentication = require("../Middleware/userAuthentication");
// const userDeviseAuthentication = require("../Middleware/userDeviseAuthentication");

// routes to create budget
router.post("/create", userAuthentication, createBudget);
// routes to get all budgets 
router.get("/:userId", userAuthentication, getAllBudgetsByUser); 
// route to get a specific budget
router.get("/:userId/:budgetId", userAuthentication, getBudgetById);
// route to update a specific budget
router.put("/:userId/:budgetId", userAuthentication, updateBudgetById); 
// route to delete a specific budget
router.delete("/:userId/:budgetId", userAuthentication, deleteBudgetById); 

// routes for fetching energy usage data
router.get("/:userId/:budgetId/energy-usage", userAuthentication, fetchEnergyUsage);
// routes for updating energy usage data
router.put("/:userId/:budgetId/energy-usage", userAuthentication, updateEnergyUsage);

module.exports = router;