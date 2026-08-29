const User = require("../models/User");

// =====================================
// GET ALL USERS
// ADMIN ONLY
// =====================================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Get All Users Error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching users",
    });
  }
};

module.exports = {
  getAllUsers,
};