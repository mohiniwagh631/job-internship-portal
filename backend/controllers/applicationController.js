const fs = require("fs");
const path = require("path");

const Application = require("../models/Application");
const Job = require("../models/Job");

// =====================================
// APPLY FOR JOB
// Candidate only
// =====================================

const createApplication = async (req, res) => {
  try {
    const {
      jobId,
      coverLetter,
    } = req.body;

    const candidateId = req.user.id;

    // Check job ID
    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    // Check resume
    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF is required",
      });
    }

    // Find active job
    const job = await Job.findOne({
      _id: jobId,
      isActive: true,
    });

    if (!job) {
      // Delete uploaded file
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(404).json({
        message:
          "Job not found or no longer active",
      });
    }

    // Check duplicate application
    const existingApplication =
      await Application.findOne({
        job: jobId,
        candidate: candidateId,
      });

    if (existingApplication) {
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(409).json({
        message:
          "You have already applied for this opportunity",
      });
    }

    // Create application
    const application =
      await Application.create({
        job: jobId,

        candidate: candidateId,

        resume: {
          originalName:
            req.file.originalname,

          fileName:
            req.file.filename,

          path:
            req.file.path,
        },

        coverLetter:
          coverLetter || "",

        status: "Applied",
      });

    const populatedApplication =
      await Application.findById(
        application._id
      )
        .populate(
          "job",
          "title company location type"
        )
        .populate(
          "candidate",
          "name email"
        );

    res.status(201).json({
      message:
        "Application submitted successfully",

      application:
        populatedApplication,
    });
  } catch (error) {
    console.error(
      "Create Application Error:",
      error
    );

    // Remove uploaded file if something failed
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (deleteError) {
        console.error(deleteError);
      }
    }

    // Duplicate MongoDB index
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "You have already applied for this opportunity",
      });
    }

    res.status(500).json({
      message:
        "Server error while submitting application",

      error: error.message,
    });
  }
};


// =====================================
// MY APPLICATIONS
// Candidate only
// =====================================

const getMyApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({
        candidate: req.user.id,
      })
        .populate(
          "job",
          "title company companyLogo location type salary deadline"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get My Applications Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching applications",
    });
  }
};


// =====================================
// CHECK MY APPLICATION FOR JOB
// Candidate only
// =====================================

const checkApplication = async (
  req,
  res
) => {
  try {
    const application =
      await Application.findOne({
        job: req.params.jobId,
        candidate: req.user.id,
      });

    res.status(200).json({
      applied: !!application,
      application: application || null,
    });
  } catch (error) {
    console.error(
      "Check Application Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while checking application",
    });
  }
};


// =====================================
// GET ALL APPLICATIONS
// Admin only
// =====================================

const getAllApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find()
        .populate(
          "job",
          "title company location type"
        )
        .populate(
          "candidate",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get All Applications Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching applications",
    });
  }
};


// =====================================
// UPDATE APPLICATION STATUS
// Admin only
// =====================================

const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    const {
      status,
    } = req.body;

    const allowedStatuses = [
      "Applied",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        message:
          "Invalid application status",
      });
    }

    const application =
      await Application.findById(
        req.params.id
      );

    if (!application) {
      return res.status(404).json({
        message:
          "Application not found",
      });
    }

    application.status = status;

    await application.save();

    const updatedApplication =
      await Application.findById(
        application._id
      )
        .populate(
          "job",
          "title company location"
        )
        .populate(
          "candidate",
          "name email"
        );

    res.status(200).json({
      message:
        "Application status updated successfully",

      application:
        updatedApplication,
    });
  } catch (error) {
    console.error(
      "Update Application Status Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while updating application",
    });
  }
};


// =====================================
// DOWNLOAD RESUME
// Admin only
// =====================================

const downloadResume = async (
  req,
  res
) => {
  try {
    const application =
      await Application.findById(
        req.params.id
      );

    if (!application) {
      return res.status(404).json({
        message:
          "Application not found",
      });
    }

    const resumePath =
      application.resume.path;

    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({
        message:
          "Resume file not found",
      });
    }

    res.download(
      resumePath,
      application.resume.originalName
    );
  } catch (error) {
    console.error(
      "Download Resume Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while downloading resume",
    });
  }
};


module.exports = {
  createApplication,
  getMyApplications,
  checkApplication,
  getAllApplications,
  updateApplicationStatus,
  downloadResume,
};