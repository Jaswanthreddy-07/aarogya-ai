const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true
    },

    dosage: {
      type: String
    },

    time: {
      type: String,
      required: true
    },

    frequency: {
      type: String
    },

    startDate: {
      type: Date
    },

    endDate: {
      type: Date
    },

    takenAt: {
      type: Date
    }
  },

  {
    timestamps: true
  }
);

module.exports = mongoose.model("Medicine", medicineSchema);