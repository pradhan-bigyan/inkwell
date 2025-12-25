const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../utilities");
const {
  createAccount,
  userLogin,
  getUser,
} = require("../controllers/userController");
const {
  addNote,
  getAllNotes,
  updateNote,
  deleteNote,
  updatePin,
  searchNotes,
} = require("../controllers/noteController");

//User Routes
router.post("/create-account", createAccount);
router.post("/login", userLogin);
router.get("/get-user", authenticateToken, getUser);

//Notes Routes
router.get("/notes", authenticateToken, getAllNotes);
router.post("/add-note", authenticateToken, addNote);
router.put("/update-note/:id", authenticateToken, updateNote);
router.delete("/delete-note/:noteId", authenticateToken, deleteNote);
router.patch("/update-pin/:id", authenticateToken, updatePin);
router.get("/search-notes", authenticateToken, searchNotes);

module.exports = router;
