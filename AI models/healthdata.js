const mongoose = require("mongoose");

const healthDataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    heartRate: {
      type: Number
    },

    spo2: {
      type: Number
    },

    temperature: {
      type: Number
    },

    source: {
      type: String,
      enum: ["manual", "face-scan", "voice-check"],
      default: "manual"
    },

    wellnessScore: {
      type: Number,
      min: 0,
      max: 100
    },

    bloodPressure: {
      systolic: {
        type: Number
      },

      diastolic: {
        type: Number
      }
    }
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model("HealthData", healthDataSchema);