const express = require("express");
const router = express.Router();

const {
  getHealthReport
} = require("../controllers/reportcontroller");

const authMiddleware = require("../middleware/authmiddleware");

// Get health report
router.get("/", authMiddleware, getHealthReport);

module.exports = router;