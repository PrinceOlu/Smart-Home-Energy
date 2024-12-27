const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Alert = require("../models/alertModel");
const userAuthentication = require("../Middleware/userAuthentication");
const deviceAuthorization = require("../Middleware/deviceAuthorization");
const { createAlert , getAllAlerts, markAlertAsRead} = require("../controller/alertController");


// route to create an alert
router.post("/create", userAuthentication, createAlert);
// route to get all alerts
router.get("/", userAuthentication, getAllAlerts);
// route to mark an alert as read
router.put("/:alertId", userAuthentication, markAlertAsRead);

module.exports = router; 


