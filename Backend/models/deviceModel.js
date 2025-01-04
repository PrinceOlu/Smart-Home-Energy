const mongoose = require("mongoose");

// define the device schema     
const deviceSchema = new mongoose.Schema({  
    name: {
        type: String,
        required: true,
    },
   type: {
        type: String,
        required: true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type: String,
        required: true,
        enum: ["Online", "Offline"],
        default: "Offline",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// create the device model
const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;