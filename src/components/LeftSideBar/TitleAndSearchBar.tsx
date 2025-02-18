import { useEffect, useRef, useState } from "react";
import { showToast } from "../ToastProvider";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { addIcon, pancileIcon, searchIcon } from "./ImportsAll";
import { useCreateNote, useSearchNotes } from "../../api/apiAxios";
import { useQueryClient } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";
import debounceFunction from "../../api/debounceFunction";
import { NavLink } from "react-router-dom";

export default function TitleAndSearchBar({ setTitle }) {
  // For Seach button and showing the search bar and ad notes
  const searchIconRef = useRef(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const [isFolderSelected, setIsFolderSelected] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const { folderId: routeFolderId } = useParams<{ folderId: string }>();
  const [folderId, setFolderId] = useState<string | undefined>(routeFolderId); // State to storing folderId
  //   const [routeNoteId, setRouteNoteId] = useState("");

  const [searchText, setSearchText] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);

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

  function navigateToNewNote(data) {
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
  const debouncedSaveNote = debounceFunction((updatedTitle: string) => {
    searchNotes(
      {
        search: updatedTitle,
      },
      {
        onSuccess: (response) => {
          // console.log(response);
          setFilteredNotes(response?.notes);
        },
      }
    );
  }, 1000); // 1-second debounce

  function handleSearchAll(e) {
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
