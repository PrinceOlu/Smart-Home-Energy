const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,    
        ref: "User",
        required: true,
    },
      message: {
        type: String,
        required: true,
    },
  isRead: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model("Alert", alertSchema);
    