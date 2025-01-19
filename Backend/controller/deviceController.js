const Device = require("../models/deviceModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
// Function to create devices       
exports.createDevices = async (req, res) => {
    try {
        const { name, status, userId, powerRating } = req.body;

        // Validate required fields
        if (!name || !userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        // Create and save the device
        const device = new Device({ name, status, userId, powerRating });
        await device.save();

        res.status(201).json({ message: "Device created successfully", device });
    } catch (error) {
        res.status(500).json({ message: "Failed to create device", error: error.message });
    }
};
 

// Function to get all devices for a specific user
// pagination added
exports.getAllDevicesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const devices = await Device.find({ userId })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalDevices = await Device.countDocuments({ userId });

        res.status(200).json({
            totalDevices,
            totalPages: Math.ceil(totalDevices / limit),
            currentPage: parseInt(page, 10),
            devices,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch devices", error });
    }
};


// Function to get a specific device by ID for a specific user
exports.getDeviceById = async (req, res) => {
    try {
        const { userId, deviceId } = req.params;
        const device = await Device.findOne({ _id: deviceId, userId });
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        res.status(200).json({ device });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch device", error });
    }
};

// Function to update a specific device by ID for a specific user   
exports.updateDeviceById = async (req, res) => {
    try {
        const { userId, deviceId } = req.params;
        const { name, type, status, powerRating, energyUsage } = req.body;
        const device = await Device.findOneAndUpdate(
            { _id: deviceId, userId },
            { name, type, status, powerRating, energyUsage },
            { new: true }
        );
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        res.status(200).json({ message: "Device updated successfully", device });
    } catch (error) {
        res.status(500).json({ message: "Failed to update device", error });
    }
};

// Function to update energy usage for a specific device by ID for a specific user
exports.updateEnergyUsage = async (req, res) => {
    try {
      // Retrieve the device from the database
      const { userId, deviceId } = req.params;
      const device = await Device.findOne({ _id: deviceId, userId });
  
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
  
      // Calculate the energy usage if the device is online
      if (device.status === "On") {
        const currentTime = new Date();
        
        // Calculate the time difference in hours
        const timeElapsedInHours = (currentTime - device.lastUpdated) / (1000 * 3600); // Time in hours
  
        // Calculate energy consumed in kWh using the formula: (Power (W) * Time (h)) / 1000
        const energyConsumed = (timeElapsedInHours * device.powerRating) / 1000; // Energy in kWh
  
        // Update the total energy usage for the device
        device.energyUsage += energyConsumed;
  
        // Store the energy consumption in the history
        device.energyConsumptionHistory.push({
          timestamp: currentTime,
          energyConsumed: energyConsumed,
        });
  
        // Update the last updated time
        device.lastUpdated = currentTime;
  
        // Save the updated device data to the database
        await device.save();
  
        res.status(200).json({ message: "Energy usage updated successfully" });
      } else {
        res.status(200).json({ message: "Device is offline, no energy usage to update" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update energy usage", error: error.message });
    }
  };
  

// Function to delete a specific device by ID for a specific user
exports.deleteDeviceById = async (req, res) => {
    try {
        const { userId, deviceId } = req.params;
        const device = await Device.findOneAndDelete({ _id: deviceId, userId });
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        res.status(200).json({ message: "Device deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete device", error });
    }
}

// function to log energy usage for a specific device by ID for a specific user
exports.logDeviceEnergyUsage = async (req, res) => {
    try {
        const { userId, deviceId } = req.params;
        const {energyConsumed} = req.body;
       
        if(!energyConsumed || energyConsumed <= 0){
            return res.status(400).json({ message: "Missing required fields" });
        }

        const device = await Device.findOne({ _id: deviceId, userId });
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        // update energy usage
        device.energyUsage += energyConsumed;

        // Store the energy consumption in the history
        device.energyConsumptionHistory.push({
          timestamp: new Date(),
          energyConsumed: energyConsumed,
        });
        device.lastUpdated = new Date();
        // Save the updated device data to the database
        await device.save();

        res.status(200).json({
            message: "Energy usage logged successfully",
        })
    } catch (error) {
        res.status(500).json({ message: "Failed to log energy usage", error });
    }
}