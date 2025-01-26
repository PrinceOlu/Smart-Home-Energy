const Alert = require("../models/alertModel");

// Create a new alert
exports.createAlert = async (req, res) => {
    try {
        const { userId, message } = req.body;

        if (!userId || !message) {
            return res.status(400).json({ error: "userId and message are required" });
        }

        const alert = new Alert({ userId, message });
        await alert.save();

        res.status(201).json(alert);
    } catch (error) {
        res.status(500).json({ error: "Error creating alert" });
    }
};

// Get all alerts for a specific user
exports.getAllAlerts = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const alerts = await Alert.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ error: "Error fetching alerts" });
    }
};

// Mark an alert as read
exports.markAlertAsRead = async (req, res) => {
    try {
        const { alertId } = req.params;

        if (!alertId) {
            return res.status(400).json({ error: "alertId is required" });
        }

        const alert = await Alert.findByIdAndUpdate(
            alertId,
            { isRead: true },
            { new: true }
        );

        if (!alert) {
            return res.status(404).json({ error: "Alert not found" });
        }

        res.status(200).json(alert);
    } catch (error) {
        res.status(500).json({ error: "Error marking alert as read" });
    }
};
