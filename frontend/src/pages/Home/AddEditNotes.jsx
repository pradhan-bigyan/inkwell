import React from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";

const AddEditNotes = ({ noteData, type, onClose }) => {
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [tags, setTags] = React.useState([]);

  const [error, setError] = React.useState(null);

  const addNewNote = () => {};

  const editNote = () => {};

  const handleAddNote = () => {
    if (!title) {
      setError("Plese enter a title for the note.");
      return;
    }

    if (!content) {
      setError("Plese enter some content for the note.");
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote;
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label for="title" className="input-label">
          Title
        </label>
        <input
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go to Gym At 5"
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <label for="content" className="input-label">
          Content
        </label>
        <textarea
          name="content"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
        />
      </div>

      <div>
        <label>Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddNote}
      >
        Save Note
      </button>
    </div>
  );
};

export default AddEditNotes;
