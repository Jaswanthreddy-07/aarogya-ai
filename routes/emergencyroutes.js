const express = require("express");
const router = express.Router();

const {
  addContact,
  getContacts,
  deleteContact,
  sendSOS
} = require("../controllers/emergencycontroller");

const authMiddleware = require("../middleware/authmiddleware");

// Add emergency contact
router.post("/contacts", authMiddleware, addContact);

// Get emergency contacts
router.get("/contacts", authMiddleware, getContacts);

// Delete emergency contact
router.delete("/contacts/:id", authMiddleware, deleteContact);

// SOS
router.post("/sos", authMiddleware, sendSOS);

module.exports = router;