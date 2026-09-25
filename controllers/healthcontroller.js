const HealthData = require("../AI models/healthdata");

// Add health data
exports.addHealthData = async (req, res) => {
  try {
    const {
      heartRate,
      spo2,
      temperature,
      source = "manual",
      wellnessScore,
      systolic,
      diastolic
    } = req.body;

    const healthData = await HealthData.create({
      user: req.user.id,
      heartRate,
      spo2,
      temperature,
      source,
      wellnessScore,
      bloodPressure: {
        systolic,
        diastolic
      }
    });

    res.status(201).json({
      message: "Health data saved",
      data: healthData
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to save health data",
      error: error.message
    });
  }
};


// Get health history
exports.getHealthHistory = async (req, res) => {
  try {
    const data = await HealthData.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.json(data);

  } catch (error) {
    res.status(500).json({
      message: "Failed to get health history",
      error: error.message
    });
  }
};


// Get latest health data
exports.getLatestHealth = async (req, res) => {
  try {
    const latest = await HealthData.findOne({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.json(latest);

  } catch (error) {
    res.status(500).json({
      message: "Failed to get latest health data",
      error: error.message
    });
  }
};