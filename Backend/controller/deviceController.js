const Device = require("../models/deviceModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
// Function to create devices       
exports.createDevices = async (req, res) => {
    try {
        const { name, type, status, userId } = req.body;

        // Validate required fields
        if (!name || !type || !userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        // Create and save the device
        const device = new Device({ name, type, status, userId });
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
        const { name, type, status } = req.body;
        const device = await Device.findOneAndUpdate(
            { _id: deviceId, userId },
            { name, type, status },
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