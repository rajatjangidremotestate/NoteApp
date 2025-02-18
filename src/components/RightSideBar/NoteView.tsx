import threeDotIcon from "../../assets/icons/ThreeDots.svg";
import dateIcon from "../../assets/icons/date.svg";
import folderIcon from "../../assets/icons/normalFolder.svg";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteNote,
  useFetchFolders,
  useFetchNote,
  useSaveNote,
  useUpdateNote,
} from "../../api/apiAxios";
import { useEffect, useRef, useState } from "react";
import { showToast } from "../ToastProvider";
import RestoreNoteView from "./RestoreNoteView";
import debounceFunction from "../../api/debounceFunction";

export default function NoteView({
  title,
  setTitle,
}: {
  title: string;
  setTitle: (pre: string) => string;
}) {
  const { folderId, noteId } = useParams();
  const [content, setContent] = useState("Content Default");
  // console.log(folderId);
  const { data: note, isLoading, error } = useFetchNote(noteId || "");
  const updateNote = useUpdateNote();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const { data: folders } = useFetchFolders();
  const deleteNoteMutation = useDeleteNote();

  const notify_01 = () => {
    showToast(
      `${
        note?.note?.isFavorite ? "Removed from Favorite" : "Added to Favorite"
      }`,
      "success"
    );
  };
  const notify_02 = () => {
    showToast(
      `${note?.note?.isArchived ? "Unarchived" : "Archived"}`,
      "success"
    );
  };

  const notify_03 = () => {
    showToast("Note Deleted successfully", "warning");
  };

  const notifyError = () => {
    showToast("Error Occurs", "error");
  };

  const navigate = useNavigate();

  const goBack = () => {
    navigate(`/folder/${folderId}`); // Navigates back to the home route
  };

  const goRestore = () => {
    navigate(`restore`); // Navigates back to the home route
  };

  const handleUpdateFavorite = (updatedFields) => {
    if (!noteId) return;
    updateNote.mutate({ noteId, updatedData: updatedFields });
    setIsOpen(false);
    notify_01();
    if (note?.note?.isFavorite && folderId === "favoriteNotes") goBack();
  };

  const handleUpdateArchived = (updatedFields) => {
    if (!noteId) return;
    updateNote.mutate({ noteId, updatedData: updatedFields });
    setIsOpen(false);
    notify_02();
    goBack();
  };

  const handleUpdateDelete = (updatedFields) => {
    deleteNoteMutation.mutate(noteId, {
      onSuccess: () => {
        notify_03();
        goRestore();
      },
      onError: () => {
        notifyError();
      },
    });
  };

  const Note = note?.note || {};

  useEffect(() => {
    const valueContent = Note.content;
    setContent(valueContent);
  }, [Note]);

  const Folders = folders?.folders || [];
  const arr =
    Note.id != undefined
      ? Folders.filter((folder) => {
          // console.log(Note);
          if (folder.id === Note.folder.id) {
            return folder;
          }
          return;
        })
      : [];
  const folderName = arr.length > 0 ? arr[0].name : "";

  //For Saving notes
  const { mutate: saveNote } = useSaveNote();

  // Debounced save function
  const debouncedSaveNote = debounceFunction(
    (updatedTitle: string, updatedContent: string) => {
      saveNote(
        {
          id: noteId,
          folderId,
          title: updatedTitle,
          content: updatedContent,
        },
        {
          onSuccess: () => {
            // console.log("Changed Note");
            const noteSavedElement = document.getElementById("noteSaved");
            if (noteSavedElement) {
              // Show the element first, then hide it after 1 second
              noteSavedElement.style.display = "block"; // or "flex" if using Flexbox
              setTimeout(() => {
                noteSavedElement.style.display = "none";
              }, 1000);
            }
          },
        }
      );
    },
    1000
  ); // 1-second debounce

  // Handle changes and trigger the debounced save
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    debouncedSaveNote(e.target.value, content);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    debouncedSaveNote(title, e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event: { target: unknown }) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (folderId === "trashNotes") return <RestoreNoteView />;

  if (isLoading)
    return (
      <div className="bg-custom_01 h-full w-3/5 p-10 flex flex-col gap-3 justify-center items-center">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "110px",
          }}
        >
          <CircularProgress
            sx={{ color: "#ffffff" }}
            size={100}
            thickness={6}
          />
        </Box>
        <p className="text-white font-custom text-5xl">Loading...</p>
      </div>
    );
  // if (isLoading === false) setContent(note.content);
  if (error) return <p>Error fetching note: {error.message}</p>;
  return (
    <div className="bg-custom_01 h-full w-3/5 p-10 flex flex-col gap-3">
      <div className="flex flex-row justify-between items-center">
        {/* <p className="font-custom text-3xl text-white">{note?.note?.title}</p> */}
        <input
          className="font-custom text-3xl text-white w-full outline-none"
          value={title}
          onChange={handleTitleChange}
        ></input>
        <div className="relative inline-block">
          <img
            src={threeDotIcon}
            alt="Menu"
            className="h-6 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
          {isOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-60 bg-custom_04 text-white shadow-lg rounded-lg border border-gray-300 overflow-hidden"
            >
              <button
                className="font-custom w-full text-left px-4 py-2 hover:bg-gray-600 hover:cursor-pointer"
                onClick={() =>
                  handleUpdateFavorite({ isFavorite: !note?.note?.isFavorite })
                }
              >
                {note?.note?.isFavorite
                  ? "⭐ Remove from Favorite"
                  : "⭐ Add to Favorite"}
              </button>
              <button
                className="font-custom w-full text-left px-4 py-2 hover:bg-gray-600 hover:cursor-pointer"
                onClick={() =>
                  handleUpdateArchived({ isArchived: !note?.note?.isArchived })
                }
              >
                {note?.note?.isArchived ? "📂 Unarchive" : "📂 Archive"}
              </button>
              <hr />
              <button
                className="font-custom w-full text-left px-4 py-2 hover:bg-gray-600 hover:cursor-pointer "
                onClick={handleUpdateDelete}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Date and Folder Details */}
      <div className="flex flex-col gap-2.5">
        <div className="flex gap-3 items-center">
          <img src={dateIcon} alt="" className="h-4" />
          <p className="text-custom text-white opacity-50 text-sm">Date</p>
          <p className="text-custom text-white underline text-sm">
            {Note.createdAt !== undefined && Note.createdAt.substring(0, 10)}
          </p>
        </div>
        <hr className="text-white opacity-40 " />
        <div className="flex gap-3 items-center">
          <img src={folderIcon} alt="" className="h-4" />
          <p className="text-custom text-white opacity-50 text-sm">Folder</p>
          <p className="text-custom text-white underline text-sm">
            {folderName}
          </p>
        </div>
      </div>

      {/* Content for the Note  */}
      <textarea
        id="textArea"
        value={content}
        onChange={handleContentChange}
        rows={10}
        className="text-white font-custom text-sm border-none outline-none"
      ></textarea>

      <div
        id="noteSaved"
        className="absolute bottom-5 right-10 text-xl bg-white text-green-700 font-custom shadow-lg  rounded py-1 px-3 font-bold hidden transition-opacity duration-500 ease-in-out"
      >
        Note Saved Successfully
      </div>
    </div>
  );
}
