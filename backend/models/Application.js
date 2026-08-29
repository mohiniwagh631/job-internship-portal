const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // =====================================
    // JOB
    // =====================================

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // =====================================
    // CANDIDATE
    // =====================================

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =====================================
    // RESUME
    // Stored in Cloudinary
    // =====================================

    resume: {
      originalName: {
        type: String,
        required: true,
      },

      fileName: {
        type: String,
        required: true,
      },

      url: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
        required: true,
      },
    },

    // =====================================
    // COVER LETTER
    // =====================================

    coverLetter: {
      type: String,
      default: "",
    },

    // =====================================
    // APPLICATION STATUS
    // =====================================

    status: {
      type: String,

      enum: [
        "Applied",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ],

      default: "Applied",
    },
  },

  {
    timestamps: true,
  }
);

// =====================================
// PREVENT DUPLICATE APPLICATIONS
// =====================================

applicationSchema.index(
  {
    job: 1,
    candidate: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Application",
  applicationSchema
);