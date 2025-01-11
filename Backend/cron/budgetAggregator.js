// const cron = require("node-cron");
// const Device = require("../models/deviceModel");
// const Budget = require("../models/budgetModel");

// // Schedule the cron job to run at midnight every day
// cron.schedule("0 0 * * *", async () => {
//   console.log("Running budget aggregation job...");

//   try {
//     // Fetch all active budgets
//     const activeBudgets = await Budget.find({ status: "Active" });

//     for (let budget of activeBudgets) {
//       // Aggregate energy usage from all devices linked to the user
//       const totalUsage = await Device.aggregate([
//         { $match: { userId: budget.userId, status: "Online" } },
//         { $group: { _id: null, totalUsage: { $sum: "$energyUsage" } } },
//       ]);

//       // Calculate total energy usage
//       const totalEnergyUsage = totalUsage[0]?.totalUsage || 0;

//       // Update budget's energy usage
//       budget.energyUsage = totalEnergyUsage;

//       // Check if the budget has exceeded the energy limit
//       budget.alerts = totalEnergyUsage > budget.energyLimit;

//       // Save the updated budget
//       await budget.save();
//     }

//     console.log("Budget aggregation job completed.");
//   } catch (error) {
//     console.error("Error in budget aggregation job:", error);
//   }
// });

// to test it manually
const cron = require("node-cron");
const Device = require("../models/deviceModel");
const Budget = require("../models/budgetModel");

// Function that handles the job logic
const aggregateBudgetUsage = async () => {
  console.log("Running budget aggregation job...");

  try {
    // Fetch all active budgets
    const activeBudgets = await Budget.find({ status: "Active" });

    for (let budget of activeBudgets) {
      // Aggregate energy usage from all devices linked to the user
      const totalUsage = await Device.aggregate([
        { $match: { userId: budget.userId, status: "Online" } },
        { $group: { _id: null, totalUsage: { $sum: "$energyUsage" } } },
      ]);

      // Calculate total energy usage
      const totalEnergyUsage = totalUsage[0]?.totalUsage || 0;

      // Update budget's energy usage
      budget.energyUsage = totalEnergyUsage;

      // Check if the budget has exceeded the energy limit
      budget.alerts = totalEnergyUsage > budget.energyLimit;

      // Save the updated budget
      await budget.save();
    }

    console.log("Budget aggregation job completed.");
  } catch (error) {
    console.error("Error in budget aggregation job:", error);
  }
};

// Schedule the cron job to run at midnight every day
cron.schedule("0 0 * * *", aggregateBudgetUsage);

// Export the function for manual triggering
module.exports = { aggregateBudgetUsage };
