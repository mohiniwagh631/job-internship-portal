const express = require("express");

const router = express.Router();

const {
  createJob,
  getJobs,
  getAllJobsForAdmin,
  getJobById,
  updateJob,
  deleteJob,
  toggleJobStatus,
} = require("../controllers/jobController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// =====================================
// PUBLIC ROUTES
// =====================================

// Get all ACTIVE jobs
router.get("/", getJobs);


// =====================================
// ADMIN - GET ALL JOBS
// Includes ACTIVE + INACTIVE
// IMPORTANT: MUST COME BEFORE /:id
// =====================================

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllJobsForAdmin
);


// =====================================
// PUBLIC - GET SINGLE ACTIVE JOB
// =====================================

router.get("/:id", getJobById);


// =====================================
// ADMIN CRUD
// =====================================

// Create job
router.post(
  "/",
  protect,
  adminOnly,
  createJob
);


// Update job
router.put(
  "/:id",
  protect,
  adminOnly,
  updateJob
);


// Delete job
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteJob
);


// Activate / Deactivate job
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  toggleJobStatus
);


module.exports = router;