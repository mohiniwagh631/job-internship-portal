const express = require("express");

const router = express.Router();

const {
  getAdminDashboard,
} = require("../controllers/adminDashboardController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// =====================================
// ADMIN DASHBOARD
// =====================================

router.get(
  "/",
  protect,
  adminOnly,
  getAdminDashboard
);

module.exports = router;