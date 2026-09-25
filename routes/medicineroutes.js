const express = require("express");
const router = express.Router();

const {
  addMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
  markMedicineTaken
} = require("../controllers/medicinecontroller");

const authMiddleware = require("../middleware/authmiddleware");

// Add medicine
router.post("/", authMiddleware, addMedicine);

// Get medicines
router.get("/", authMiddleware, getMedicines);

// Update medicine
router.put("/:id", authMiddleware, updateMedicine);

router.patch("/:id/taken", authMiddleware, markMedicineTaken);

// Delete medicine
router.delete("/:id", authMiddleware, deleteMedicine);

module.exports = router;