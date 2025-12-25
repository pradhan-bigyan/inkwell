require("dotenv").config();
const Note = require("../models/note_model");

const addNote = async (req, res) => {
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
};

const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.user.id;

    const notes = await Note.findAllNotes(userId);
    res.status(200).json({ notes: notes });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

const updateNote = async (req, res) => {
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
};

const deleteNote = async (req, res) => {
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
      .json({ message: "Note deleted successfully.", error: false });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

const updatePin = async (req, res) => {
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
};

const searchNotes = async (req, res) => {
  try {
    const userId = req.user.user.id;
    const { q } = req.query;

    if (!q || q.trim() === "") {
      const notes = await Note.findAllNotes(userId);
      return res.status(200).json(notes);
    }

    const searchTerm = q.trim();

    const searchNotes = await Note.search(userId, searchTerm);
    return res.status(200).json({
      notes: searchNotes,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server error",
    });
  }
};

module.exports = {
  addNote,
  getAllNotes,
  updateNote,
  deleteNote,
  updatePin,
  searchNotes,
};
