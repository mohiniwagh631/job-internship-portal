const Job = require("../models/Job");

// =====================================
// CREATE JOB / INTERNSHIP
// Admin only
// =====================================
const createJob = async (req, res) => {
  try {
    const {
      company,
      companyLogo,
      title,
      description,
      location,
      type,
      salary,
      skills,
      eligibility,
      experience,
      deadline,
    } = req.body;

    if (
      !company ||
      !title ||
      !description ||
      !location ||
      !type ||
      !salary ||
      !deadline
    ) {
      return res.status(400).json({
        message:
          "Company, title, description, location, type, salary and deadline are required",
      });
    }

    const job = await Job.create({
      company,
      companyLogo: companyLogo || "",
      title,
      description,
      location,
      type,
      salary,

      skills: Array.isArray(skills) ? skills : [],

      eligibility: eligibility || "",

      experience: experience || "Fresher",

      deadline,

      isActive: true,

      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);

    res.status(500).json({
      message: "Server error while creating job",
      error: error.message,
    });
  }
};

// =====================================
// GET ALL ACTIVE JOBS
// Public
// =====================================
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      isActive: true,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);

    res.status(500).json({
      message: "Server error while fetching jobs",
    });
  }
};

// =====================================
// GET ALL JOBS FOR ADMIN
// Includes ACTIVE + INACTIVE
// Admin only
// =====================================
const getAllJobsForAdmin = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get Admin Jobs Error:", error);

    res.status(500).json({
      message: "Server error while fetching admin jobs",
    });
  }
};

// =====================================
// GET SINGLE ACTIVE JOB
// Public
// =====================================
const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("createdBy", "name email");

    if (!job) {
      return res.status(404).json({
        message: "Job not found or no longer active",
      });
    }

    res.status(200).json({
      job,
    });
  } catch (error) {
    console.error("Get Job Error:", error);

    res.status(500).json({
      message: "Server error while fetching job",
    });
  }
};

// =====================================
// UPDATE JOB
// Admin only
// =====================================
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const {
      company,
      companyLogo,
      title,
      description,
      location,
      type,
      salary,
      skills,
      eligibility,
      experience,
      deadline,
    } = req.body;

    job.company = company ?? job.company;
    job.companyLogo = companyLogo ?? job.companyLogo;
    job.title = title ?? job.title;
    job.description = description ?? job.description;
    job.location = location ?? job.location;
    job.type = type ?? job.type;
    job.salary = salary ?? job.salary;

    job.skills = Array.isArray(skills)
      ? skills
      : job.skills;

    job.eligibility =
      eligibility ?? job.eligibility;

    job.experience =
      experience ?? job.experience;

    job.deadline =
      deadline ?? job.deadline;

    const updatedJob = await job.save();

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update Job Error:", error);

    res.status(500).json({
      message: "Server error while updating job",
      error: error.message,
    });
  }
};

// =====================================
// DELETE JOB
// Admin only
// =====================================
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete Job Error:", error);

    res.status(500).json({
      message: "Server error while deleting job",
    });
  }
};

// =====================================
// ACTIVATE / DEACTIVATE JOB
// Admin only
// =====================================
const toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    job.isActive = !job.isActive;

    const updatedJob = await job.save();

    res.status(200).json({
      message: updatedJob.isActive
        ? "Job activated successfully"
        : "Job deactivated successfully",

      job: updatedJob,
    });
  } catch (error) {
    console.error("Toggle Job Status Error:", error);

    res.status(500).json({
      message: "Server error while changing job status",
    });
  }
};

// =====================================
// EXPORT
// =====================================
module.exports = {
  createJob,
  getJobs,
  getAllJobsForAdmin,
  getJobById,
  updateJob,
  deleteJob,
  toggleJobStatus,
};