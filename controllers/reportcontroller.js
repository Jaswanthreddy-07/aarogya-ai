const HealthData = require("../AI models/healthdata");
const HealthReport = require("../AI models/healthreport");

// Generate health report
exports.getHealthReport = async (req, res) => {
  try {
    const data = await HealthData.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    if (data.length === 0) {
      return res.status(404).json({
        message: "No health data available"
      });
    }

    const totalHeartRate = data.reduce(
      (sum, item) => sum + (item.heartRate || 0),
      0
    );

    const heartRateRecords = data.filter(item => item.heartRate != null);
    const averageHeartRate = heartRateRecords.length
      ? totalHeartRate / heartRateRecords.length
      : null;

    const totalSpo2 = data.reduce(
      (sum, item) => sum + (item.spo2 || 0),
      0
    );

    const spo2Records = data.filter(item => item.spo2 != null);
    const averageSpo2 = spo2Records.length
      ? totalSpo2 / spo2Records.length
      : null;

    const report = await HealthReport.create({
      user: req.user.id,
      reportType: "daily",
      totalRecords: data.length,
      averageHeartRate,
      averageSpo2,
      notes: "Generated from your saved wellness readings."
    });

    res.json({
      reportId: report._id,
      generatedAt: report.generatedAt,
      totalRecords: data.length,
      averageHeartRate: Number(averageHeartRate.toFixed(2)),
      averageSpo2: Number(averageSpo2.toFixed(2)),
      records: data
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to generate report",
      error: error.message
    });
  }
};