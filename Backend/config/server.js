const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./db");
const errorMiddleware = require("../../middleware/errormiddleware");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../../frontend")));
app.use("/css", express.static(path.join(__dirname, "../../css")));

// Test route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});

// Routes
app.use("/api/auth", require("../../routes/authroutes"));
app.use("/api/users", require("../../routes/userroutes"));
app.use("/api/health", require("../../routes/healthroutes"));
app.use("/api/medicines", require("../../routes/medicineroutes"));
app.use("/api/emergency", require("../../routes/emergencyroutes"));
app.use("/api/reports", require("../../routes/reportsroutes"));

// Error middleware
app.use(errorMiddleware);

// Start only after MongoDB is ready so requests cannot reach an unconnected app.
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Arogya AI Server running on port ${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });