import { useCallback, useEffect, useRef, useState } from "react";
import { showToast } from "../ToastProvider";
import { Link, useParams, useNavigate } from "react-router-dom";
import { addIcon, pancileIcon, searchIcon } from ".";
import { Note, useCreateNote, useSearchNotes } from "../../api/apiHooks";
import { useQueryClient } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";
import useDebounceFunction from "../../api/useDebounceFunction";

const notify_03 = () => {
  showToast("Select one folder !", "warning");
};

const notify_01 = () => {
  showToast("Note Added !", "success");
};

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
  const [folderId, setFolderId] = useState<string | undefined>(routeFolderId);

  const [searchText, setSearchText] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (routeFolderId) {
      setFolderId(routeFolderId);
      setIsClicked(false);
    }
  }, [routeFolderId, folderId]);

  const queryClient = useQueryClient();
  const createNote = useCreateNote();

  interface NoteData {
    id: string;
  }

  const navigateToNewNote = useCallback(
    (data: NoteData) => {
      navigate(`/folder/${routeFolderId}/note/${data.id}`);
    },
    [routeFolderId, navigate]
  );

  const addnewNoteFuntion = useCallback(() => {
    if (isFolderSelected) {
      createNote.mutate(
        {
          folderId: routeFolderId,
          title: "New_Note_Title",
          content: "New Note Content",
        },
        {
          onSuccess: (data) => {
            // Refetch necessary queries
            queryClient.refetchQueries({
              queryKey: ["folder-notes", routeFolderId],
            });
            queryClient.refetchQueries({
              queryKey: ["recent-notes"],
            });

            // Notify success
            notify_01();

            // Navigate to the new note if the ID exists
            if (data && data.id) {
              setTitle("Default Title");
              navigateToNewNote(data); // Use navigateToNewNote here
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
  }, [
    isFolderSelected,
    routeFolderId,
    createNote,
    queryClient,
    navigateToNewNote,
    setTitle,
  ]);

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

  const handleSearchAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearchText(e.target.value);
      debouncedSaveNote(e.target.value);
    },
    [debouncedSaveNote]
  );

  // Toggle the search and add note bar according to search icon
  const toggleSearchBar = useCallback(() => {
    setIsSearchVisible((prev) => !prev);
    setSearchText("");

    setTimeout(() => {
      if (searchIconRef.current) {
        searchIconRef.current.focus();
      }
    }, 100);
  }, [setIsSearchVisible, setSearchText, searchIconRef]);

  return (
    <>
      <div className="flex flex-row justify-between h-1/15 items-center px-5">
        {/* Title and pancile icon  */}
        <div className="flex gap-1.5 hover:cursor-pointer">
          <p className="text-white custom-title">INotes</p>
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
