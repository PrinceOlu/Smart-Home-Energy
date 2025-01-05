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

module.exports = { getEnergyUsage };