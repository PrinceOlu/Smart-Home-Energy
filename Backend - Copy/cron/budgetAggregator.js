const cron = require("node-cron");
const Device = require("../models/deviceModel");
const Budget = require("../models/budgetModel");

// Schedule the cron job to run at midnight every day
cron.schedule("0 * * * *", async () =>  {
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
});

// // Run the cron job every hour
// cron.schedule("0 * * * *", async () => {
//     console.log("Cron job started: Updating energy usage...");
  
//     try {
//       const devices = await Device.find(); // Fetch all devices from the database
      
//       for (const device of devices) {
//         // Simulate calling the updateEnergyUsage logic
//         const req = { params: { userId: device.userId, deviceId: device._id } };
//         const res = { 
//           status: (code) => ({ json: (data) => console.log(`Status ${code}:`, data) }),
//         };
  
//         await updateEnergyUsage(req, res);
//       }
  
//       console.log("Energy usage updated successfully for all devices.");
//     } catch (error) {
//       console.error("Error running cron job:", error.message);
//     }
//   });