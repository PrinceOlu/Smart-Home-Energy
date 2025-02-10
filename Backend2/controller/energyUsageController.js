const mongoose = require("mongoose");
const Device = require("../models/deviceModel");

const getEnergyUsage = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find all the devices for a specific user
        const devices = await Device.find({ userId });

        // Calculate the total energy usage for all devices
        const totalEnergyUsage = devices.reduce((total, device) => total + device.energyUsage, 0);

        // Check if any device consumes excessive energy
        const highEnergyDevices = devices.filter((device) => device.energyUsage > 10);

        // Respond with the energy usage data and list of high-energy devices
        res.status(200).json({
            totalEnergyUsage,
            highEnergyDevices,
            devices, // Optional: If the frontend needs all devices with their energy usage
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch energy usage",
            error: error.message,
        });
    }
};

// function to get total energy usage for a specific user based on date (e.g., February 2025)
const getEnergyUsageByDate = async (req, res) => {
    try {
      const { userId, date } = req.params;
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1); // Next month, same day, for the range
      
      // Find all devices for the user where createdAt is within the selected month
      const devices = await Device.find({
        userId,
        createdAt: { $gte: startDate, $lt: endDate }
      });
      
      // Calculate the total energy usage for the selected month
      const totalEnergyUsage = devices.reduce((total, device) => total + device.energyUsage, 0);
      
      res.status(200).json({ totalEnergyUsage });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch energy usage", error });
    }
  };

module.exports = { getEnergyUsage, getEnergyUsageByDate };