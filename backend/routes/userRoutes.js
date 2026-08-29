const express = require("express");

const router = express.Router();

const {
  getAllUsers,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// =====================================
// GET ALL USERS
// ADMIN ONLY
// =====================================

router.get(
  "/",
  protect,
  adminOnly,
  getAllUsers
);

module.exports = router;