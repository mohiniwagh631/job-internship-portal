const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// =====================================
// GET ADMIN DASHBOARD DATA
// Admin only
// =====================================

const getAdminDashboard = async (req, res) => {
  try {
    // =====================================
    // BASIC COUNTS
    // =====================================

    const totalUsers = await User.countDocuments({
      role: { $ne: "admin" },
    });

    const totalJobs = await Job.countDocuments();

    const activeJobs = await Job.countDocuments({
      isActive: true,
    });

    const totalApplications =
      await Application.countDocuments();

    const selectedCandidates =
      await Application.countDocuments({
        status: "Selected",
      });

    // =====================================
    // APPLICATION STATUS COUNTS
    // =====================================

    const applied =
      await Application.countDocuments({
        status: "Applied",
      });

    const shortlisted =
      await Application.countDocuments({
        status: "Shortlisted",
      });

    const interview =
      await Application.countDocuments({
        status: "Interview",
      });

    const selected =
      await Application.countDocuments({
        status: "Selected",
      });

    const rejected =
      await Application.countDocuments({
        status: "Rejected",
      });

    // =====================================
    // RECENT APPLICATIONS
    // =====================================

    const recentApplications =
      await Application.find()
        .populate(
          "candidate",
          "name email"
        )
        .populate(
          "job",
          "title company location"
        )
        .sort({
          createdAt: -1,
        })
        .limit(8);

    // =====================================
    // RECENT JOBS
    // =====================================

    const recentJobs =
      await Job.find()
        .sort({
          createdAt: -1,
        })
        .limit(6)
        .select(
          "title company location type isActive createdAt"
        );

    // =====================================
    // SEND RESPONSE
    // =====================================

    res.status(200).json({
      success: true,

      statistics: {
        totalUsers,
        totalJobs,
        activeJobs,
        totalApplications,
        selectedCandidates,
      },

      applicationStats: {
        Applied: applied,
        Shortlisted: shortlisted,
        Interview: interview,
        Selected: selected,
        Rejected: rejected,
      },

      recentApplications,

      recentJobs,
    });

  } catch (error) {

    console.error(
      "Admin Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while loading admin dashboard",
    });
  }
};


module.exports = {
  getAdminDashboard,
};