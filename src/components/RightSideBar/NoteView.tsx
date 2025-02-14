import threeDotIcon from "../../assets/icons/ThreeDots.svg";
import dateIcon from "../../assets/icons/date.svg";
import folderIcon from "../../assets/icons/normalFolder.svg";
import { useFetchFolders, useFetchNote } from "../../api/apiAxios";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function NoteView() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { noteId } = useParams<{ noteId: string }>();
  const { data: note, isLoading, error } = useFetchNote(noteId || "");

  const { data: folders } = useFetchFolders();

  const Note = note?.note || {};
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

  if (!noteId)
    return (
      <div className="bg-custom_01 h-full w-3/5 p-10 flex flex-col gap-3">
        {/* Title for current Note  */}
        <div className="flex flex-row justify-between items-center">
          <p className="font-custom text-3xl text-white">No note selected</p>
        </div>
      </div>
    );
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching note: {error.message}</p>;

  return (
    <div className="bg-custom_01 h-full w-3/5 p-10 flex flex-col gap-3">
      {/* Title for current Note  */}
      <div className="flex flex-row justify-between items-center">
        <p className="font-custom text-3xl text-white">
          {Note.title != undefined && Note.title}
        </p>
        {/* <img src={threeDotIcon} alt="" className="h-6 hover:cursor-pointer" /> */}
        <div className="relative inline-block">
          {/* Three-dot Button */}
          <img
            src={threeDotIcon} // Change to your actual icon path
            alt="Menu"
            className="h-6 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-44 bg-slate-200 shadow-lg rounded-lg border border-gray-300 overflow-hidden"
            >
              <button
                className="font-custom w-full text-left px-4 py-2 hover:bg-white hover:cursor-pointer"
                onClick={() => alert("Favorited!")}
              >
                ⭐ Favorite
              </button>
              <button
                className="font-custom w-full text-left px-4 py-2 hover:bg-white hover:cursor-pointer"
                onClick={() => alert("Archived!")}
              >
                📂 Archive
              </button>
              <button
                className="font-custom w-full text-left px-4 py-2 hover:bg-white hover:cursor-pointer text-red-500"
                onClick={() => alert("Deleted!")}
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
      <p id="textArea" className="text-white font-custom text-sm ">
        {Note.content != undefined && Note.content}
      </p>
    </div>
  );
}
