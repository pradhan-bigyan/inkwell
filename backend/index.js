const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { pool, checkConnection } = require("./db/connect");
const User = require("./models/user_model");
const { authenticateToken } = require("./utilities");
const app = express();

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

const PORT = 8000;

app.get("/", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.post("/create-account", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(409).json({ message: "User already exists." });
    }

    const result = await User.create(fullName, email, password);

    const accessToken = jwt.sign({ result }, process.env.JWT_SECRET, {
      expiresIn: "72h",
    });

    return res.json({
      error: false,
      message: "Account created successfully.",
      user: result,
      accessToken,
    });
  } catch (error) {
    console.error("Error in /create-account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/login", async (req, res) => {
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
});

const start = async () => {
  try {
    await checkConnection();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;
