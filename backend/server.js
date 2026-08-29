const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();

// =====================================
// MIDDLEWARE
// =====================================

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// =====================================
// CONNECT DATABASE
// =====================================

connectDB();

// =====================================
// TEST ROUTE
// =====================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "JobHub Backend API is running successfully",
  });
});

// =====================================
// API ROUTES
// =====================================

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/admin/dashboard", adminDashboardRoutes);

app.use("/api/users", userRoutes);

// =====================================
// 404 API HANDLER
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// =====================================
// ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// =====================================
// START SERVER
// =====================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `JobHub server running on port ${PORT}`
  );
});