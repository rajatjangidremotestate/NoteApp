import { NavLink, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { showToast } from "../ToastProvider";

import {
  useFetchFolders,
  useCreateFolder,
  useUpdateFolder,
} from "../../api/apiAxios";
import {
  addFloderIcon,
  normalFolderIcon,
  selecteFolderIcon,
} from "./ImportsAll";
import { useEffect, useRef, useState } from "react";

export default function Folders() {
  const { data, isLoading: LodingFolders, isError } = useFetchFolders();
  const { mutate: mutateNewFolder } = useCreateFolder();
  const { mutate: mutateUpdateFolder } = useUpdateFolder();
  const folders = data?.folders || [];
  // console.log(folders);

  const notify_01 = () => {
    showToast("New Folder Added !", "success");
  };
  const notify_02 = () => {
    showToast("Folder Updated !", "success");
  };
  const notify_03 = () => {
    showToast("!! Error !!", "error");
  };

  // For Editing Folder Name
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");
  // Tracking for Update Loading
  const [isUpdating, setIsUpdating] = useState(false);
  //Tracking for adding New Folder Loading
  const [isAdding, setIsAdding] = useState(false);

  const { folderId, noteId } = useParams();

  // useEffect(() => {
  //   if (folderId === undefined) {
  //     const firstFolderId = folders.length > 0 && folders[0].id;
  //     <Navigate to={`/folder/${firstFolderId}`} />;
  //   }
  // }, [folderId, folders]);

  // When we select any note then automatically select that note folder and focus it
  const activeRef = useRef(null);
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

  // Add new folder in backend
  const handleAddFolder = () => {
    // mutateNewFolder({ name: "New_Folder" });
    setIsAdding(true); // Start loading before API call

    mutateNewFolder(
      { name: "New_Folder" },
      {
        onSuccess: () => {
          notify_01();
          setIsAdding(false); // Stop loading when successful
        },
        onError: () => {
          setIsAdding(false); // Stop loading if there's an error
        },
      }
    );
  };

  //  Enable rename mode
  const handleDoubleClick = (id: string, name: string) => {
    setEditingId(id);
    setNewName(name);
  };

  //  Save renamed folder
  const handleRename = (id: string) => {
    if (newName.trim() === "") return;
    // mutateUpdateFolder({ folderId: id, updatedData: { name: newName } });

    setIsUpdating(true); // Start loading before API call
    mutateUpdateFolder(
      { folderId: id, updatedData: { name: newName } },
      {
        onSuccess: () => {
          notify_02();
          setIsUpdating(false); // Stop loading when successful
        },
        onError: () => {
          notify_03();
          setIsUpdating(false); // Stop loading if there's an error
        },
      }
    );

    setEditingId(null);
  };

  //Testing Loading and all
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
              {/* <NavLink
                to={`/folder/${folder.id}`}
                className="flex px-4 py-1 gap-2 items-center hover:bg-gray-800"
                ref={folder.id === folderId ? activeRef : null}
              >
                <img src={normalFolderIcon} alt="" className="h-4" />
                <p
                  className={`flex font-custom text-white text-sm ${
                    folder.id === folderId ? "opacity-full" : "opacity-60"
                  }`}
                >
                  {folder.name}
                </p>
              </NavLink> */}
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
                  ref={folder.id === folderId ? activeRef : null}
                  onDoubleClick={() =>
                    handleDoubleClick(folder.id, folder.name)
                  }
                >
                  {/* <Box
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
                  </Box> */}
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
