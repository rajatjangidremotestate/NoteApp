import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import folderIcon from "../../assets/icons/normalFolder.svg";
import dateIcon from "../../assets/icons/date.svg";
import { useCreateNote, useFetchFolders } from "../../api/apiAxios";
import { useQueryClient } from "@tanstack/react-query";
import { showToast } from "../ToastProvider";

export default function AddNewNotePage() {
  const { folderId } = useParams<{ folderId: string }>();
  const { data: folders } = useFetchFolders();

  const navigate = useNavigate();

  const goBack = () => {
    navigate(`/folder/${folderId}`); // Navigates back to the home route
  };

  const createNoteMutation = useCreateNote();

  // ✅ Get the current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split("T")[0];

  // ✅ Find folder name based on folderId
  const folderName =
    folders?.folders?.find((folder) => folder.id === folderId)?.name ||
    "Unknown Folder";

  // ✅ State for title and content
  const [title, setTitle] = useState("Defalut Title");
  const [content, setContent] = useState("Defalut Content");

  const queryClient = useQueryClient();

  const notify_01 = () => {
    showToast("Note Added !", "success");
  };

  const handleCreateNote = async () => {
    if (!title.trim()) {
      alert("Folder ID and title are required!");
      return;
    }

    createNoteMutation.mutate(
      { folderId, title, content },
      {
        onSuccess: (_, variables) => {
          queryClient.refetchQueries({
            queryKey: ["folder-notes", variables.folderId],
          });
          // console.log("Note created successfully!");
          notify_01();
          goBack();
        },
        onError: (error) => {
          console.error("Error creating note:", error);
        },
      }
    );
  };

  return (
    <>
      <div className="bg-custom_01 h-full w-3/5 p-10 flex flex-col gap-3">
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-white font-custom text-3xl bg-transparent border-none outline-none"
        />

        {/* Date & Folder Section */}
        <div className="flex flex-col gap-2.5">
          {/* Date */}
          <div className="flex gap-3 items-center">
            <img src={dateIcon} alt="" className="h-4" />
            <p className="text-custom text-white opacity-50 text-sm">Date</p>
            <p className="text-custom text-white underline text-sm">
              {currentDate}
            </p>
          </div>

          <hr className="text-white opacity-40 " />

          {/* Folder */}
          <div className="flex gap-3 items-center">
            <img src={folderIcon} alt="" className="h-4" />
            <p className="text-custom text-white opacity-50 text-sm">Folder</p>
            <p className="text-custom text-white underline text-sm">
              {folderName}
            </p>
          </div>
        </div>

        {/* Content Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="text-white font-custom text-sm bg-transparent border-none outline-none"
          rows={20}
        ></textarea>

        {/* Save Button */}
        <button
          onClick={handleCreateNote}
          disabled={createNoteMutation.isPending}
          className="font-custom bg-blue-700 text-white p-2 rounded hover:cursor-pointer"
        >
          {createNoteMutation.isPending ? "Creating..." : "Add as New Note"}
        </button>
      </div>
    </>
  );
}
