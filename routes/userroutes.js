const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  addFamilyMember
} = require("../controllers/usercontroller");

const authMiddleware = require("../middleware/authmiddleware");

// Get profile
router.get("/profile", authMiddleware, getProfile);

// Update profile
router.put("/profile", authMiddleware, updateProfile);

// Add family member
router.post("/family", authMiddleware, addFamilyMember);

module.exports = router;