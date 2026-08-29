const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================================
// REGISTER USER
// =====================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      education,
      skills,
      experience,
    } = req.body;

    console.log(
      "Registration request received:",
      req.body
    );

    // ================================
    // VALIDATION
    // ================================

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanName =
      name.trim();

    // ================================
    // CHECK EXISTING USER
    // ================================

    const existingUser =
      await User.findOne({
        email: cleanEmail,
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          "User already exists with this email",
      });
    }

    // ================================
    // HASH PASSWORD
    // ================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ================================
    // CREATE USER
    // ================================

    const user = await User.create({
      name: cleanName,

      email: cleanEmail,

      password: hashedPassword,

      phone: phone || "",

      education: education || "",

      skills: Array.isArray(skills)
        ? skills
        : [],

      experience: experience || "",

      role: "candidate",
    });

    console.log(
      "New candidate created:",
      user.email
    );

    // ================================
    // CREATE JWT
    // ================================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ================================
    // RESPONSE
    // ================================

    return res.status(201).json({
      message:
        "Registration successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.error(
      "Registration Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during registration",

      error: error.message,
    });
  }
};


// =====================================
// LOGIN USER
// =====================================

const loginUser = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;

    // ================================
    // VALIDATION
    // ================================

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const cleanEmail =
      email.trim().toLowerCase();

    // ================================
    // FIND USER
    // ================================

    const user =
      await User.findOne({
        email: cleanEmail,
      });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // ================================
    // CHECK PASSWORD
    // ================================

    const isPasswordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // ================================
    // JWT
    // ================================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log(
      "Login successful:",
      user.email
    );

    // ================================
    // RESPONSE
    // ================================

    return res.status(200).json({

      message:
        "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

    });

  } catch (error) {

    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during login",
    });
  }
};


// =====================================
// EXPORT
// =====================================

module.exports = {
  registerUser,
  loginUser,
};