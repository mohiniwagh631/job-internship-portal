const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    // Company Information
    company: {
      type: String,
      required: true,
      trim: true,
    },

    companyLogo: {
      type: String,
      default: "",
    },

    // Job / Internship Information
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Location
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // Job or Internship
    type: {
      type: String,
      enum: ["Full Time", "Part Time", "Internship", "Contract"],
      required: true,
    },

    // Salary / Stipend
    salary: {
      type: String,
      required: true,
      trim: true,
    },

    // Required Skills
    skills: {
      type: [String],
      default: [],
    },

    // Eligibility
    eligibility: {
      type: String,
      default: "",
      trim: true,
    },

    // Experience Level
    experience: {
      type: String,
      enum: ["Fresher", "Junior", "Mid Level", "Senior"],
      default: "Fresher",
    },

    // Application Deadline
    deadline: {
      type: Date,
      required: true,
    },

    // Job status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Admin who created the job
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);