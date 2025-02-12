import pancileIcon from "../assets/icons/pancile_01.svg";
import searchIcon from "../assets/icons/search_02.svg";
import addIcon from "../assets/icons/AddIcon.svg";
import recentNoteIcon from "../assets/icons/recent_03.svg";
import addFloderIcon from "../assets/icons/newFolder_04.svg";
import normalFolderIcon from "../assets/icons/normalFolder.svg";
import favoritesIcon from "../assets/icons/Favorites.svg";
import trashIcon from "../assets/icons/Trash.svg";
import archivedIcon from "../assets/icons/ArchivedNote.svg";
import { useRef, useState } from "react";

export default function LeftSideBar() {
  // For Seach button and showing the search bar and ad notes
  const searchIconRef = useRef(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearchBar = () => {
    setIsSearchVisible((prev) => !prev);

    // Focus on the input field when opening
    setTimeout(() => {
      if (searchIconRef.current) {
        searchIconRef.current.focus();
      }
    }, 100);
  };

  // All Data Arrays
  const recentNotes = [
    "Reflection on the Month of June",
    "Project proposal",
    "Travel itinerary",
    "random",
  ];

  const folders = ["Personal", "Work", "Travel", "Events", "Finances"];

  // Toggle the search and add note bar according to search icon

  return (
    <div className="bg-custom_01 h-full w-1/5 py-7 flex flex-col gap-4">
      {/* logo and search icon dev */}
      <div className="flex flex-row justify-between h-10 items-center px-5">
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
            <div className="flex flex-row items-center justify-center h-full ">
              <img src={addIcon} alt="" className="h-4" />
              <p className="font-custom font-bold text-white">New Note</p>
            </div>
          </div>
        )}
      </div>

      {/* recents notes div */}
      <div className="flex flex-col gap-1.5">
        {/* Recents Heading  */}
        <div>
          <p className="text-white px-5 font-custom opacity-60">Recents</p>
        </div>

        {/* All Recent Notes */}
        <ul className="flex flex-col gap-1">
          {recentNotes.slice(0, 3).map((note, index) => (
            <li
              key={index}
              className={`flex items-center gap-2 px-4 py-1 hover:cursor-pointer  ${
                index === 0 ? "active" : ""
              }`}
            >
              <img src={recentNoteIcon} alt="" className="h-4" />
              <p
                className={`text-white font-custom text-sm ${
                  index === 0 ? "opacity-full" : "opacity-60"
                }`}
              >
                {note}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* All Folders Div */}
      <div className="flex flex-col gap-1">
        {/* Folder Heading and add new Folder icon  */}
        <div className="flex justify-between px-4">
          <p className="font-custom text-white opacity-60">Folders</p>
          <img src={addFloderIcon} alt="" className="hover:cursor-pointer" />
        </div>

        {/* All Folders  */}
        <nav>
          <ul>
            {folders.map((folder, index) => (
              <li key={index}>
                <a href="" className="flex px-4 py-1 gap-2 items-center">
                  <img src={normalFolderIcon} alt="" className="h-4" />
                  <p className="flex font-custom text-white opacity-60 text-sm">
                    {folder}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* More 1. Favorites 2. Trash 3. Archived Notes  */}
      <div className="flex flex-col gap-1">
        {/* More Heading  */}
        <div className="flex justify-between px-4">
          <p className="font-custom text-white opacity-60">More</p>
        </div>
        <div>
          <ul>
            {/* Favorites */}
            <li>
              <a href="" className="flex px-4 py-1 gap-2 items-center">
                <img src={favoritesIcon} alt="" className="h-4" />
                <p className="flex font-custom text-white opacity-60 text-sm">
                  Favorites
                </p>
              </a>
            </li>

            {/* Trash */}
            <li>
              <a href="" className="flex px-4 py-1 gap-2 items-center">
                <img src={trashIcon} alt="" className="h-4" />
                <p className="flex font-custom text-white opacity-60 text-sm">
                  Trash
                </p>
              </a>
            </li>

            {/* Archived Notes */}
            <li>
              <a href="" className="flex px-4 py-1 gap-2 items-center">
                <img src={archivedIcon} alt="" className="h-4" />
                <p className="flex font-custom text-white opacity-60 text-sm">
                  Archived Notes
                </p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
