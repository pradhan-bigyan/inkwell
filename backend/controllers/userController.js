const jwt = require("jsonwebtoken");
const User = require("../models/user_model");
const bcrypt = require("bcrypt");
require("dotenv").config();

const createAccount = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(409).json({ message: "User already exists." });
    }

    const user = await User.create(fullName, email, password);

    const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "72h",
    });

    return res.json({
      error: false,
      message: "Account created successfully.",
      user: user,
      accessToken,
    });
  } catch (error) {
    console.error("Error in /create-account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "72h",
    });

    return res.json({
      error: false,
      message: "Login successful.",
      accessToken,
      email,
    });
  } catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user.user.id;

    const user = await User.getUser(userId);

    return res.status(200).json({
      user,
    });
  } catch (error) {}
};

module.exports = {
  createAccount,
  userLogin,
  getUser,
};
