const mongoose = require("mongoose");

const healthReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    reportType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily"
    },

    averageHeartRate: {
      type: Number
    },

    averageSpo2: {
      type: Number
    },

    totalRecords: {
      type: Number,
      default: 0
    },

    notes: {
      type: String
    },

    generatedAt: {
      type: Date,
      default: Date.now
    }
  }
);

module.exports = mongoose.model(
  "HealthReport",
  healthReportSchema
);