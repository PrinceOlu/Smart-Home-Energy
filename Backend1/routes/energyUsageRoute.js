// route for energyUsage
const express = require("express");
const router = express.Router();
const { getEnergyUsage, getEnergyUsageByDate } = require("../controller/energyUsageController");

// route to get energy usage data
router.get("/:userId", getEnergyUsage);

// route to get energy usage data for a specific month
router.get("/:userId/:date", getEnergyUsageByDate);

module.exports = router;