import React, { useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import EmptyCard from "../../components/Cards/EmptyCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import Toast from "../../components/ToastMessage/Toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import AddNoteImg from "../../assets/addNoteImg.svg";
import EmptyNoteImg from "../../assets/emptyNote.svg";
const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = React.useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = React.useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = React.useState([]);

  const [userInfo, setUserInfo] = React.useState(null);

  const [isSearch, setIsSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again.");
    }
  };

  const deleteNote = async (data) => {
    const noteId = data.id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      showToastMessage("Note Deleted Successfully", "delete");
      getAllNotes();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An unexpected error occurred. Please try again.");
      }
    }
  };

  const onSearchNote = async (q) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { q },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearch(false);
    getAllNotes();
  };

  const updateIsPinned = async (data) => {
    const noteId = data.id;
    try {
      const response = await axiosInstance.patch("/update-pin/" + noteId, {
        isPinned: !data.is_pinned,
      });

      if (response.data && response.data.note) {
        {
          response.data.note.is_pinned
            ? showToastMessage("Note Pinned Successfully")
            : showToastMessage("Note Unpinned Successfully");
        }
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
      />

      <div className="container mx-auto px-4">
        {allNotes.length > 0 ? (
          <>
            <div className="flex mt-2 justify-between">
              <h1 className="text-2xl font-bold text-gray-800">My Notes</h1>
              <button
                className="btn-primary w-25 text-white"
                onClick={() => {
                  setOpenAddEditModal({ ...openAddEditModal, isShown: true });
                }}
              >
                Add Note
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {allNotes.map((note) => {
                return (
                  <NoteCard
                    key={note.id}
                    title={note.title}
                    date={note.created_at}
                    content={note.content}
                    tags={note.tags}
                    isPinned={note.is_pinned}
                    onEdit={() => handleEdit(note)}
                    onDelete={() => deleteNote(note)}
                    onPinNote={() => updateIsPinned(note)}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? EmptyNoteImg : AddNoteImg}
            message={
              isSearch
                ? `Oops! Can't find the note that you are looking for.`
                : `Start Creating your note: Click the '+' button to write down you thoughts, ideas.`
            }
          />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-secondary absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ ...openAddEditModal, isShown: true });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
        contentLabel=""
        className="w-[80%] max-h-80vh bg-white rounded-md mx-auto mt-14 p-5 overflow-auto max-w-[600px]"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
