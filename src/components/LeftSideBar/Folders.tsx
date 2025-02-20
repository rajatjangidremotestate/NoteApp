import { NavLink, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { showToast } from "../ToastProvider";

import {
  useFetchFolders,
  useCreateFolder,
  useUpdateFolder,
  Folder,
} from "../../api/apiHooks";
import { addFloderIcon, normalFolderIcon, selecteFolderIcon } from ".";
import { useCallback, useEffect, useRef, useState } from "react";

const notify_03 = () => {
  showToast("!! Error !!", "error");
};

export default function Folders() {
  const { data, isLoading: LodingFolders, isError } = useFetchFolders();
  const { mutate: mutateNewFolder } = useCreateFolder();
  const { mutate: mutateUpdateFolder } = useUpdateFolder();
  const folders: Folder[] = data?.folders || [];

  // For Editing Folder Name
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");
  // Tracking for Update Loading
  const [isUpdating, setIsUpdating] = useState(false);
  //Tracking for adding New Folder Loading
  const [isAdding, setIsAdding] = useState(false);
  const { folderId, noteId } = useParams();

  const activeRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (activeRef.current !== null) {
      if (activeRef.current) {
        activeRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [folderId, noteId]);

  const handleAddFolder = useCallback(() => {
    setIsAdding(true); // Start loading before API call

    mutateNewFolder(
      { name: "New_Folder" },
      {
        onSuccess: () => {
          showToast("New Folder Added!", "success");
          setIsAdding(false); // Stop loading when successful
        },
        onError: () => {
          setIsAdding(false); // Stop loading if there's an error
        },
      }
    );
  }, [mutateNewFolder, setIsAdding]);

  const handleDoubleClick = useCallback(
    (id: string, name: string) => {
      setEditingId(id);
      setNewName(name);
    },
    [setEditingId, setNewName]
  );

  //  Save renamed folder

  const handleRename = useCallback(
    (id: string) => {
      if (newName.trim() === "") return;

      setIsUpdating(true); // Start loading before API call
      mutateUpdateFolder(
        { folderId: id, updatedData: { name: newName } },
        {
          onSuccess: () => {
            showToast("Folder Updated!", "success");
            setIsUpdating(false); // Stop loading when successful
          },
          onError: () => {
            notify_03();
            setIsUpdating(false); // Stop loading if there's an error
          },
        }
      );

      setEditingId(null);
    },
    [newName, mutateUpdateFolder, setIsUpdating, setEditingId]
  );

  // if (LodingFolders) return <p>Loading Folders...</p>;
  if (isError) return <p>Failed to load Folder.</p>;

  return (
    <div className="flex flex-col flex-1 min-h-6/15 bg-custom_02">
      {/* Folder Heading and add new Folder icon  */}
      <div className="flex justify-between px-4 h-1/10 items-center border-b-2 border-b-black">
        <div className="flex items-center gap-1.5">
          {(LodingFolders || isAdding) && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "12px",
              }}
            >
              <CircularProgress
                sx={{ color: "#ffffff" }}
                size={10}
                thickness={8}
              />
            </Box>
          )}
          <p className="font-custom text-white opacity-60">
            Folders{LodingFolders}
          </p>
        </div>
        <img
          src={addFloderIcon}
          alt=""
          className="hover:cursor-pointer h-4"
          onClick={handleAddFolder}
        />
      </div>

      {/* All Folders  */}
      <nav className="flex h-9/10 overflow-clip w-full">
        <ul className="overflow-y-scroll w-full">
          {folders.map((folder) => (
            <li key={folder.id}>
              {editingId === folder.id ? (
                <div className="flex px-4 py-1 gap-2 items-center">
                  <img
                    src={normalFolderIcon}
                    alt="Folder Icon"
                    className="h-4"
                  />
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={() => handleRename(folder.id)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleRename(folder.id)
                    }
                    autoFocus
                    className="bg-gray-700 text-white"
                  />
                </div>
              ) : (
                <NavLink
                  to={`/folder/${folder.id}`}
                  className="flex px-4 py-1 gap-2 items-center hover:bg-gray-800"
                  ref={(el) => {
                    if (folder.id === folderId) {
                      activeRef.current = el;
                    }
                  }}
                  onDoubleClick={() =>
                    handleDoubleClick(folder.id, folder.name)
                  }
                >
                  {isUpdating && folder.id === folderId ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "12px",
                      }}
                    >
                      <CircularProgress
                        sx={{ color: "#ffffff" }}
                        size={10}
                        thickness={8}
                      />
                    </Box>
                  ) : (
                    <img
                      src={`${
                        folder.id === folderId
                          ? selecteFolderIcon
                          : normalFolderIcon
                      }`}
                      alt="Folder Icon"
                      className="h-4"
                    />
                  )}
                  <p
                    className={`flex font-custom text-white text-sm ${
                      folder.id === folderId ? "opacity-full" : "opacity-60"
                    }`}
                  >
                    {folder.name}
                  </p>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
