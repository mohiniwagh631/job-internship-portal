const express = require("express");

const router = express.Router();

const {
  createApplication,
  getMyApplications,
  checkApplication,
  getAllApplications,
  updateApplicationStatus,
  downloadResume,
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const uploadResume = require("../middleware/uploadMiddleware");


// =====================================
// CANDIDATE ROUTES
// =====================================

// Apply for job
router.post(
  "/",
  protect,
  uploadResume.single("resume"),
  createApplication
);


// My applications
router.get(
  "/my",
  protect,
  getMyApplications
);


// Check application
router.get(
  "/check/:jobId",
  protect,
  checkApplication
);


// =====================================
// ADMIN ROUTES
// =====================================

// Get all applications
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllApplications
);


// Update status
router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  updateApplicationStatus
);


// Download resume
router.get(
  "/admin/:id/resume",
  protect,
  adminOnly,
  downloadResume
);


module.exports = router;