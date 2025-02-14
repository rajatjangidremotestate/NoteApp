import pancileIcon from "../../assets/icons/pancile_01.svg";
import searchIcon from "../../assets/icons/search_02.svg";
import addIcon from "../../assets/icons/AddIcon.svg";
import { useEffect, useRef, useState } from "react";
import More from "./More.tsx";
import Folders from "./Folders.tsx";
import RecentNotes from "./RecentNotes.tsx";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
export default function LeftSideBar() {
  // For Seach button and showing the search bar and ad notes
  const searchIconRef = useRef(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const [isFolderSelected, setIsFolderSelected] = useState(true);
  const [isClicked, setIsClicked] = useState(false);

  const { folderId: routeFolderId } = useParams<{ folderId: string }>(); // Get folderId from URL
  const [folderId, setFolderId] = useState<string | undefined>(routeFolderId); // State to store folderId
  const [route, setRoute] = useState(`/folder/${folderId}/note/newNote`);

  const notify_03 = () => toast.warning("Select one folder !");

  useEffect(() => {
    if (routeFolderId) {
      setFolderId(routeFolderId); // Update folderId state when route changes
      setRoute(`/folder/${folderId}/note/newNote`);
    }
  }, [routeFolderId, folderId]); // Runs every time routeFolderId changes

  useEffect(() => {
    if (
      folderId === undefined ||
      folderId === "favoriteNotes" ||
      folderId === "archivedNotes" ||
      folderId === "trashNotes"
    ) {
      if (
        (folderId === undefined ||
          folderId === "favoriteNotes" ||
          folderId === "archivedNotes" ||
          folderId === "trashNotes") &&
        isClicked === true
      ) {
        alert("Select one folder from folders");
        setIsClicked(false);
        // notify_03();
      }
      setIsFolderSelected(false);
    } else {
      setIsFolderSelected(true);
    }
  }, [isClicked, folderId]);

  // ToggleSearch Bar Function
  const toggleSearchBar = () => {
    setIsSearchVisible((prev) => !prev);

    // Focus on the input field when opening
    setTimeout(() => {
      if (searchIconRef.current) {
        searchIconRef.current.focus();
      }
    }, 100);
  };

  // Toggle the search and add note bar according to search icon
  return (
    <div className="bg-custom_01 h-full w-1/5 py-5 flex flex-col gap-4">
      {/* logo and search icon dev */}
      <div className="flex flex-row justify-between h-10 items-center px-5">
        {/* <ToastContainer /> */}

        {/* Title and pancile icon  */}
        <div className="flex gap-1.5 hover:cursor-pointer">
          <p className="text-white custom-title">Nowted</p>
          <img src={pancileIcon} alt="" className="h-4" />
        </div>

        {/* Search Icon used searchIconRef for handling search bar focus */}
        <div className="hover:cursor-pointer">
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
      <div className="w-full h-8 px-5">
        {/* Search Bar  */}
        {isSearchVisible && (
          <div className="bg-custom_04 w-full h-full rounded-sm">
            <div className="flex flex-row items-center h-full">
              <img
                src={searchIcon}
                alt=""
                className="absolute left-6 opacity-40 h-4"
              />
              <input
                type="text"
                ref={searchIconRef}
                placeholder="Search note"
                className=" text-white pl-6 w-full font-semibold font-custom"
              />
            </div>
          </div>
        )}

        {/* add Note Bar  */}
        {!isSearchVisible && (
          <div className="bg-custom_04 w-full h-full rounded-sm hover:cursor-pointer">
            <Link
              to={isFolderSelected ? route : ""}
              className="flex flex-row items-center justify-center h-full "
              onClick={() => setIsClicked(true)}
            >
              <img src={addIcon} alt="" className="h-4" />
              <p className="font-custom font-bold text-white">New Note</p>
            </Link>
          </div>
        )}
      </div>
      {/* recents notes div */}
      <RecentNotes />
      {/* All Folders Div */}
      <Folders />
      {/* More 1. Favorites 2. Trash 3. Archived Notes  */}
      <More />
    </div>
  );
}
