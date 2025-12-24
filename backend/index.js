const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { pool, checkConnection } = require("./db/connect");
const User = require("./models/user_model");
const Note = require("./models/note_model");
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

app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user.id;

    const user = await User.getUser(userId);

    return res.status(200).json({
      user,
    });
  } catch (error) {}
});

app.post("/add-note", authenticateToken, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const userId = req.user.user.id;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required." });
    }

    const newNote = await Note.create(title, content, tags, userId);
    res
      .status(201)
      .json({ message: "Note created successfully.", note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/notes", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user.id;
    if (!userId) {
      navigate("/login");
    }

    const notes = await Note.findAllNotes(userId);
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

app.put("/update-note/:id", authenticateToken, async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.user.id;
    const updates = req.body;

    const NoteExists = await Note.findNote(noteId, userId);

    if (!NoteExists) {
      return res.status(404).json({ message: "Note not found." });
    }

    const updatedNote = await Note.update(noteId, userId, updates);
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found." });
    }

    res.json({ message: "Note updated successfully.", note: updatedNote });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const userId = req.user.user.id;

    const NoteExists = await Note.findNote(noteId, userId);

    if (!NoteExists) {
      return res.status(404).json({ message: "Note not found." });
    }

    const deleted = await Note.delete(noteId, userId);

    res
      .status(204)
      .json({ message: "Note deleted successfully.", status: deleted });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

app.patch("/update-pin/:id", authenticateToken, async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.user.id;
    const { isPinned } = req.body;
    const updatedNote = await Note.updatePinStatus(noteId, userId, isPinned);

    if (!updatedNote) {
      res.status(404).json({ message: "Note not found." });
    }

    res.status(200).json({ message: "Pin status updated.", note: updatedNote });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/search-notes", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user.id;
    const { q } = req.query;

    if (!q || q.trim() === "") {
      const notes = await Note.findAllNotes(userId);
      return res.status(200).json(notes);
    }

    const searchTerm = q.trim();

    const searchNotes = await Note.search(userId, searchTerm);
    return res.status(200).json(searchNotes);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
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
