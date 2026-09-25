const mongoose = require("mongoose");

const emergencyEventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    message: { type: String, default: "Emergency alert request received" },
    recipients: [{ type: String }],
    deliveryResults: [{
      phone: String,
      status: String,
      error: String
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmergencyEvent", emergencyEventSchema);