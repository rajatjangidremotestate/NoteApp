import threeDotIcon from "../../assets/icons/ThreeDots.svg";
import dateIcon from "../../assets/icons/date.svg";
import folderIcon from "../../assets/icons/normalFolder.svg";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { useNavigate, useParams } from "react-router-dom";
import {
  Note,
  NoteData,
  useDeleteNote,
  useFetchFolders,
  useFetchNote,
  useSaveNote,
  useUpdateNote,
} from "../../api/apiHooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { showToast } from "../ToastProvider";
import RestoreNoteView from "./RestoreNoteView";
import useDebounceFunction from "../../api/useDebounceFunction";
import SelectNoteView from "./SelectNoteView";

const notify_01 = (note: Note) => {
  showToast(
    `${note?.isFavorite ? "Removed from Favorite" : "Added to Favorite"}`,
    "success"
  );
};
const notify_02 = (note: Note) => {
  showToast(`${note?.isArchived ? "Unarchived" : "Archived"}`, "success");
};

const notify_03 = () => {
  showToast("Note Deleted successfully", "success");
};

const notifyError = () => {
  showToast("Error Occurs", "error");
};

export default function NoteView({
  title,
  setTitle,
}: {
  title: string;
  setTitle: (pre: string) => void;
}) {
  const { folderId, noteId } = useParams();
  const [content, setContent] = useState("Content Default");
  // console.log(folderId);
  const { data: note, isLoading, error } = useFetchNote(noteId || "");
  const updateNote = useUpdateNote(note?.note?.folderId ?? "", 1);
  const [isOpen, setIsOpen] = useState(false);
  // const menuRef = useRef(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: folders } = useFetchFolders();
  const deleteNoteMutation = useDeleteNote(folderId ?? "", 1);

  const navigate = useNavigate();

  const goBack = () => {
    navigate(`/folder/${folderId}`); // Navigates back to the home route
  };

  const goRestore = () => {
    navigate(`restore`); // Navigates back to the home route
  };

  const handleUpdateFavorite = (updatedFields: NoteData) => {
    if (!noteId) return;
    updateNote.mutate({ noteId, updatedData: updatedFields });
    setIsOpen(false);
    notify_01(note?.note);
    if (note?.note?.isFavorite && folderId === "favoriteNotes") goBack();
  };

  const handleUpdateArchived = (updatedFields: NoteData) => {
    if (!noteId) return;
    updateNote.mutate({ noteId, updatedData: updatedFields });
    setIsOpen(false);
    notify_02(note?.note);
    goBack();
  };

  const handleUpdateDelete = () => {
    if (!noteId) {
      notifyError(); // Handle the undefined case
      return;
    }
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

  // const Note = note?.note || {};
  const Note = useMemo(() => note?.note || {}, [note?.note]);

  useEffect(() => {
    const valueContent = Note.content;
    // console.log("Note Title changed to : " + Note.content);
    setTitle(Note.title);
    setContent(valueContent);
  }, [Note, setTitle]);

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
  const { mutate: saveNote } = useSaveNote(folderId ?? "", 1);

  const debouncedSaveNote = useDebounceFunction(
    useCallback(
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
              // Show the "note saved" message
              const noteSavedElement = document.getElementById("noteSaved");
              if (noteSavedElement) {
                noteSavedElement.style.display = "block"; // Show the element
                setTimeout(() => {
                  noteSavedElement.style.display = "none"; // Hide after 1 second
                }, 1000);
              }
            },
          }
        );
      },
      [noteId, folderId, saveNote] // Add dependencies like noteId and folderId to ensure they are available
    ),
    400
  );

  // Handle changes and trigger the debounced save
  const handleTitleChange = useCallback(
    (e: { target: { value: string } }) => {
      setTitle(e.target.value);
      debouncedSaveNote(e.target.value, content);
    },
    [content, debouncedSaveNote, setTitle]
  );

  const handleContentChange = useCallback(
    (e: { target: { value: string } }) => {
      setContent(e.target.value);
      debouncedSaveNote(title, e.target.value);
    },
    [debouncedSaveNote, title]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
  if (Note?.deletedAt !== null) return <SelectNoteView />;
  return (
    <div className="bg-custom_01 h-full w-3/5 p-10 flex flex-col gap-3">
      <div className="flex flex-row justify-between items-center">
        {/* <p className="font-custom text-3xl text-white">{note?.note?.title}</p> */}
        <input
          className="font-custom text-3xl text-white w-full outline-none"
          value={title || ""}
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
              className="absolute right-0 mt-2 w-60 bg-custom_02 text-white shadow-lg rounded-lg border border-gray-300 overflow-hidden"
            >
              <button
                className="font-custom w-full text-left px-4 py-2 hover:bg-gray-600 hover:cursor-pointer"
                onClick={() =>
                  handleUpdateFavorite({
                    isFavorite: !note?.note?.isFavorite,
                  })
                }
              >
                {note?.note?.isFavorite
                  ? "⭐ Remove from Favorite"
                  : "⭐ Add to Favorite"}
              </button>
              <button
                className="font-custom w-full text-left px-4 py-2 hover:bg-gray-600 hover:cursor-pointer"
                onClick={() =>
                  handleUpdateArchived({
                    isArchived: !note?.note?.isArchived,
                  })
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
