import { useNavigate, useParams } from "react-router-dom";
import restoreIcon from "../../assets/icons/restore.svg";
import { useFetchNote, useRestoreNote } from "../../api/apiAxios";
import { showToast } from "../ToastProvider";
import { useEffect, useState } from "react";

export default function RestoreNoteView() {
  const { folderId, noteId } = useParams() as {
    folderId: string;
    noteId: string;
  };
  const restoreNoteMutation = useRestoreNote(folderId, 1);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteFolderId, setNoteFolderId] = useState("");
  const { data } = useFetchNote(noteId || "");
  const notifyRestored = () => {
    showToast("Restored Successfully", "success");
  };

  const notifyError = () => {
    showToast("Error Occurs", "error");
  };

  const navigate = useNavigate();

  const goBack = (noteId: string) => {
    navigate(`/folder/${noteFolderId}/note/${noteId}`);
    // if (folderId !== "trashNotes")
    // // Navigates back to the home route
    // else navigate(`/folder/${folderId}`);
  };

  const handleRestore = () => {
    restoreNoteMutation.mutate(noteId, {
      onSuccess: () => {
        notifyRestored();
        goBack(noteId);
      },
      onError: () => {
        notifyError();
      },
    });
  };

  useEffect(() => {
    if (data?.note?.title) setNoteTitle(data.note.title);
    if (data?.note?.folderId) setNoteFolderId(data.note.folderId);
    // console.log(data);
  }, [data]);

  return (
    <div className="bg-custom_01 h-full w-3/5 p-10 flex flex-col gap-3 items-center justify-center ">
      <img src={restoreIcon} alt="" className="h-20" />
      <p className="font-custom text-3xl text-center text-white">
        Restore "{noteTitle}""
      </p>
      <p className="font-custom text-sm text-white text-center w-4/5">
        Don't want to lose this note? It's not too late! Just click the
        'Restore' button and it will be added back to your list. It's that
        simple.
      </p>
      <button
        className="bg-gray-300 rounded-sm px-2 py-1 hover:cursor-pointer"
        onClick={() => handleRestore()}
      >
        Restore
      </button>
    </div>
  );
}
