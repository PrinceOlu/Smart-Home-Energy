const express = require("express");
const router = express.Router();
const {
    createDevices,
    getAllDevicesByUser,
    getDeviceById,
    deleteDeviceById,
    updateDeviceById,
    updateEnergyUsage,
    logDeviceEnergyUsage
} = require("../controller/deviceController");
const userAuthentication = require("../Middleware/userAuthentication");
const { deviceAuthorization, userDeviseAuthentication } = require("../Middleware/deviceAuthorization");

// Route to create a new device for a specific user
router.post("/create",  createDevices);

// Route to get all devices for a specific user
router.get("/:userId",getAllDevicesByUser);

// Route to get a specific device by ID for a specific user
router.get("/:userId/:deviceId",getDeviceById);

// Route to update a specific device by ID for a specific user
router.put("/:userId/:deviceId",  updateDeviceById);

// Route to delete a specific device by ID for a specific user
router.delete("/:userId/:deviceId",  deleteDeviceById);

// Route to update energy usage for a specific device by ID for a specific user
router.put("/:userId/:deviceId/energy-usage", updateEnergyUsage);

// route to add all energy usage for the active budget
router.put("/:deviceId/log-energy", logDeviceEnergyUsage);
module.exports = router;
