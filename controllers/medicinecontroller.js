const Medicine = require("../AI models/medicine");

// Add medicine
exports.addMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create({
      user: req.user.id,
      name: req.body.name,
      dosage: req.body.dosage,
      time: req.body.time,
      frequency: req.body.frequency,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });

    res.status(201).json({
      message: "Medicine added successfully",
      medicine
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to add medicine",
      error: error.message
    });
  }
};


// Get medicines
exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      user: req.user.id
    }).sort({ time: 1 });

    res.json(medicines);

  } catch (error) {
    res.status(500).json({
      message: "Failed to get medicines",
      error: error.message
    });
  }
};


// Update medicine
exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found"
      });
    }

    res.json({
      message: "Medicine updated",
      medicine
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update medicine",
      error: error.message
    });
  }
};


// Delete medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found"
      });
    }

    res.json({
      message: "Medicine deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete medicine",
      error: error.message
    });
  }
};

exports.markMedicineTaken = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { takenAt: new Date() },
      { new: true }
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json({ message: "Medicine marked as taken", medicine });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark medicine as taken",
      error: error.message
    });
  }
};