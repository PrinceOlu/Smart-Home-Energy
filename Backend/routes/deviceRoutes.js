const express = require("express");
const router = express.Router();
const {
    createDevices,
    getAllDevicesByUser,
    getDeviceById,
    deleteDeviceById,
} = require("../controller/deviceController");
const userAuthentication = require("../Middleware/userAuthentication");
const { deviceAuthorization, userDeviseAuthentication } = require("../Middleware/deviceAuthorization");

// Route to create a new device for a specific user
router.post("/create", userAuthentication, deviceAuthorization, createDevices);

// Route to get all devices for a specific user
router.get("/:userId", userAuthentication,deviceAuthorization,getAllDevicesByUser);

// Route to get a specific device by ID for a specific user
router.get("/:userId/:deviceId", userAuthentication,deviceAuthorization,getDeviceById);

// Route to delete a specific device by ID for a specific user
router.delete("/:userId/:deviceId", userAuthentication,deviceAuthorization, deleteDeviceById);

module.exports = router;
