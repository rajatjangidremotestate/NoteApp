import { useEffect, useRef, useState } from "react";
import { showToast } from "../ToastProvider";
import { Link, useParams, useNavigate } from "react-router-dom";
import { addIcon, pancileIcon, searchIcon } from ".";
import { Note, useCreateNote, useSearchNotes } from "../../api/apiAxios";
import { useQueryClient } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";
import useDebounceFunction from "../../api/useDebounceFunction";

export default function TitleAndSearchBar({
  setTitle,
}: {
  setTitle: (pre: string) => void;
}) {
  // For Seach button and showing the search bar and ad notes
  const searchIconRef = useRef<HTMLInputElement>(null);

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const [isFolderSelected, setIsFolderSelected] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const { folderId: routeFolderId } = useParams() as {
    folderId: string;
  };
  const [folderId, setFolderId] = useState<string | undefined>(routeFolderId); // State to storing folderId
  //   const [routeNoteId, setRouteNoteId] = useState("");

  const [searchText, setSearchText] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  const navigate = useNavigate();

  const notify_03 = () => {
    showToast("Select one folder !", "warning");
  };

  useEffect(() => {
    if (routeFolderId) {
      setFolderId(routeFolderId);
      setIsClicked(false);
    }
  }, [routeFolderId, folderId]);

  const notify_01 = () => {
    showToast("Note Added !", "success");
  };
  const queryClient = useQueryClient();
  const createNote = useCreateNote();

  interface NoteData {
    id: string;
  }
  function navigateToNewNote(data: NoteData) {
    navigate(`/folder/${routeFolderId}/note/${data.id}`);
  }

  //Add new NOTE lOGIC
  function addnewNoteFuntion() {
    console.log("Clicked To Add Note");
    console.log("Folder: " + isFolderSelected);
    console.log("isClicked: " + isClicked);
    if (isFolderSelected) {
      console.log(routeFolderId);
      createNote.mutate(
        {
          folderId: routeFolderId,
          title: "New_Note_Title",
          content: "New Note Content",
        },
        {
          onSuccess: (data) => {
            queryClient.refetchQueries({
              queryKey: ["folder-notes", routeFolderId],
            });
            queryClient.refetchQueries({
              queryKey: ["recent-notes"],
            });
            notify_01();
            if (data && data.id) {
              setTitle("Default Title");
              navigateToNewNote(data);
            } else {
              console.error("Error: Note ID is missing from API response.");
            }
          },
          onError: (error) => {
            console.error("Error creating note:", error);
          },
        }
      );
    }
  }

  useEffect(() => {
    if (
      folderId === undefined ||
      folderId === "favoriteNotes" ||
      folderId === "archivedNotes" ||
      folderId === "trashNotes"
    ) {
      setIsClicked(false);
      setIsFolderSelected(false);
      // console.log("Not Selected");
    } else {
      setIsFolderSelected(true);
      // console.log("Selected");
    }
  }, [folderId]);

  useEffect(() => {
    if (isClicked === true && !isFolderSelected) {
      // alert("Select one folder from folders");
      setIsClicked(false);
      notify_03();
    }
  }, [isClicked, isFolderSelected]);

  //fOR Search Bar apI
  const { mutate: searchNotes } = useSearchNotes();

  // Debounced save function
  const debouncedSaveNote = useDebounceFunction((updatedTitle: string) => {
    searchNotes(updatedTitle, {
      onSuccess: (response) => {
        // console.log(response);
        setFilteredNotes(response?.notes);
      },
    });
  }, 1000); // 1-second debounce

  function handleSearchAll(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setSearchText(e.target.value);
    debouncedSaveNote(e.target.value);
  }

  function searchNoteClicked() {
    console.log("Seached OHKK");
  }

  // Toggle the search and add note bar according to search icon
  const toggleSearchBar = () => {
    setIsSearchVisible((prev) => !prev);
    setSearchText("");
    // Focus on the input field when opening
    setTimeout(() => {
      if (searchIconRef.current) {
        searchIconRef.current.focus();
      }
    }, 100);
  };

  return (
    <>
      <div className="flex flex-row justify-between h-1/15 items-center px-5">
        {/* Title and pancile icon  */}
        <div className="flex gap-1.5 hover:cursor-pointer">
          <p className="text-white custom-title">Nowted</p>
          <img src={pancileIcon} alt="" className="h-4" />
        </div>
        <div className="flex flex-col justify-center ml-3 bg-blue-600 rounded-full">
          <input
            type="checkbox"
            name="light-switch"
            className="light-switch sr-only"
          />
          <label className="relative cursor-pointer p-2">
            <svg
              className="dark:block"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-blue-600"
                d="M7 0h2v2H7zM12.88 1.637l1.414 1.415-1.415 1.413-1.413-1.414zM14 7h2v2h-2zM12.95 14.433l-1.414-1.413 1.413-1.415 1.415 1.414zM7 14h2v2H7zM2.98 14.364l-1.413-1.415 1.414-1.414 1.414 1.415zM0 7h2v2H0zM3.05 1.706 4.463 3.12 3.05 4.535 1.636 3.12z"
              />
              <path
                className="fill-blue-500"
                d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z"
              />
            </svg>
            {/* <svg
              className="hidden dark:block"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-slate-400"
                d="M6.2 1C3.2 1.8 1 4.6 1 7.9 1 11.8 4.2 15 8.1 15c3.3 0 6-2.2 6.9-5.2C9.7 11.2 4.8 6.3 6.2 1Z"
              />
              <path
                className="fill-slate-500"
                d="M12.5 5a.625.625 0 0 1-.625-.625 1.252 1.252 0 0 0-1.25-1.25.625.625 0 1 1 0-1.25 1.252 1.252 0 0 0 1.25-1.25.625.625 0 1 1 1.25 0c.001.69.56 1.249 1.25 1.25a.625.625 0 1 1 0 1.25c-.69.001-1.249.56-1.25 1.25A.625.625 0 0 1 12.5 5Z"
              />
            </svg> */}
            <span className="sr-only">Switch to light / dark version</span>
          </label>
        </div>
        {/* Search Icon used searchIconRef for handling search bar focus */}
        <div className="flex  gap-1 hover:cursor-pointer">
          <button
            className={`opacity-40 h-4 hover:cursor-pointer transition-transform duration-500 ease-in-out ${
              isSearchVisible ? "rotate-45" : "rotate-0"
            }`}
          >
            {isSearchVisible ? (
              <img src={addIcon} alt="" onClick={toggleSearchBar} />
            ) : (
              <img src={searchIcon} alt="" onClick={toggleSearchBar} />
            )}
          </button>
        </div>
      </div>

      {/* search bar or add note bar */}
      <div className="w-full h-1/15 px-5">
        {/* Search Bar  */}
        {isSearchVisible && (
          <div className="bg-custom_04 w-ful rounded-sm">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row items-center">
                <img
                  src={searchIcon}
                  alt=""
                  className="absolute left-6 opacity-40 h-4"
                />
                <input
                  type="text"
                  ref={searchIconRef}
                  value={searchText}
                  onChange={handleSearchAll}
                  placeholder="Search note"
                  className=" text-white pl-6 w-full font-semibold font-custom h-full"
                />
              </div>

              {searchText && filteredNotes.length > 0 && (
                <ul className="flex flex-col w-full bg-custom_02 border border-gray-700 rounded-b-md shadow-lg z-50 max-h-50 overflow-y-auto">
                  {filteredNotes.map((note) => (
                    <Link
                      to={`/folder/${note.folderId}/note/${note.id}`}
                      key={note.id}
                      onClick={searchNoteClicked}
                      className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-white"
                    >
                      {note.title}
                    </Link>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* add Note Bar  */}
        {!isSearchVisible && (
          <div className="bg-custom_04 w-full h-full rounded-sm hover:cursor-pointer">
            <Link
              to={""}
              className="flex flex-row items-center justify-center h-full "
              onClick={() => {
                setIsClicked(true);
                addnewNoteFuntion();
              }}
            >
              {!createNote.isPending ? (
                <img src={addIcon} alt="" className="h-4" />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "20px",
                    width: "30px",
                  }}
                >
                  <CircularProgress
                    sx={{ color: "#ffffff" }}
                    size={15}
                    thickness={5}
                  />
                </Box>
              )}
              <p className="font-custom font-bold mr-3 text-white">
                {createNote.isPending ? "Creating New Note" : "New Note"}
              </p>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
