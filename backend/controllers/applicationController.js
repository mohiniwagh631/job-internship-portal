const cloudinary = require("../config/cloudinary");

const Application = require("../models/Application");
const Job = require("../models/Job");

// =====================================
// UPLOAD BUFFER TO CLOUDINARY
// =====================================

const uploadResumeToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "jobhub/resumes",

          // Important for PDF files
          resource_type: "raw",
        },

        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

    uploadStream.end(fileBuffer);
  });
};

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

    // =====================================
    // CHECK JOB ID
    // =====================================

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    // =====================================
    // CHECK RESUME
    // =====================================

    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF is required",
      });
    }

    // =====================================
    // FIND ACTIVE JOB
    // =====================================

    const job = await Job.findOne({
      _id: jobId,
      isActive: true,
    });

    if (!job) {
      return res.status(404).json({
        message:
          "Job not found or no longer active",
      });
    }

    // =====================================
    // CHECK DUPLICATE APPLICATION
    // =====================================

    const existingApplication =
      await Application.findOne({
        job: jobId,
        candidate: candidateId,
      });

    if (existingApplication) {
      return res.status(409).json({
        message:
          "You have already applied for this opportunity",
      });
    }

    // =====================================
    // UPLOAD RESUME TO CLOUDINARY
    // =====================================

    const uploadResult =
      await uploadResumeToCloudinary(
        req.file.buffer
      );

    // =====================================
    // CREATE APPLICATION
    // =====================================

    const application =
      await Application.create({
        job: jobId,

        candidate: candidateId,

        resume: {
          originalName:
            req.file.originalname,

          fileName:
            uploadResult.original_filename ||
            req.file.originalname,

          url:
            uploadResult.secure_url,

          publicId:
            uploadResult.public_id,
        },

        coverLetter:
          coverLetter || "",

        status: "Applied",
      });

    // =====================================
    // POPULATE APPLICATION
    // =====================================

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

    // =====================================
    // SUCCESS
    // =====================================

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

    // =====================================
    // DUPLICATE MONGODB INDEX
    // =====================================

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "You have already applied for this opportunity",
      });
    }

    // =====================================
    // CLOUDINARY / SERVER ERROR
    // =====================================

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

      application:
        application || null,
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

    // =====================================
    // CHECK STATUS
    // =====================================

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        message:
          "Invalid application status",
      });
    }

    // =====================================
    // FIND APPLICATION
    // =====================================

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

    // =====================================
    // UPDATE STATUS
    // =====================================

    application.status = status;

    await application.save();

    // =====================================
    // POPULATE UPDATED APPLICATION
    // =====================================

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
// VIEW / DOWNLOAD RESUME
// Admin only
// =====================================

const downloadResume = async (
  req,
  res
) => {
  try {

    // =====================================
    // FIND APPLICATION
    // =====================================

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

    // =====================================
    // CHECK CLOUDINARY URL
    // =====================================

    if (!application.resume?.url) {
      return res.status(404).json({
        message:
          "Resume file not found",
      });
    }

    // =====================================
    // REDIRECT TO CLOUDINARY
    // =====================================

    return res.redirect(
      application.resume.url
    );

  } catch (error) {

    console.error(
      "Download Resume Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while opening resume",
    });
  }
};

// =====================================
// EXPORT
// =====================================

module.exports = {
  createApplication,

  getMyApplications,

  checkApplication,

  getAllApplications,

  updateApplicationStatus,

  downloadResume,
};