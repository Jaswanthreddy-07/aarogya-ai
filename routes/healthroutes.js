const express = require("express");
const router = express.Router();

const {
  addHealthData,
  getHealthHistory,
  getLatestHealth
} = require("../controllers/healthcontroller");

const authMiddleware = require("../middleware/authmiddleware");

// Add health data
router.post("/", authMiddleware, addHealthData);

// Get health history
router.get("/history", authMiddleware, getHealthHistory);

// Get latest health data
router.get("/latest", authMiddleware, getLatestHealth);

module.exports = router;