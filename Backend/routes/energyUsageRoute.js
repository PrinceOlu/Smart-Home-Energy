// route for energyUsage
const express = require("express");
const router = express.Router();
const { getEnergyUsage } = require("../controller/energyUsageController");

// route to get energy usage data
router.get("/:userId", getEnergyUsage);

module.exports = router;