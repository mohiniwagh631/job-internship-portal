const multer = require("multer");

// =====================================
// STORE FILE TEMPORARILY IN MEMORY
// =====================================

const storage = multer.memoryStorage();

// =====================================
// ONLY PDF RESUMES
// =====================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF resumes are allowed"),
      false
    );
  }
};

// =====================================
// MULTER CONFIGURATION
// =====================================

const uploadResume = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = uploadResume;