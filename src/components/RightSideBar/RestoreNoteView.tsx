import { useNavigate, useParams } from "react-router-dom";
import restoreIcon from "../../assets/icons/restore.svg";
import { useRestoreNote } from "../../api/apiAxios";
import { showToast } from "../ToastProvider";

export default function RestoreNoteView() {
  const { folderId, noteId } = useParams();
  const restoreNoteMutation = useRestoreNote();

  const notifyRestored = () => {
    showToast("Restored Successfully", "success");
  };

  const notifyError = () => {
    showToast("Error Occurs", "error");
  };

  const navigate = useNavigate();

  const goBack = () => {
    if (folderId !== "trashNotes")
      navigate(
        `/folder/${folderId}/note/${noteId}`
      ); // Navigates back to the home route
    else navigate(`/folder/${folderId}`);
  };

  const handleRestore = () => {
    restoreNoteMutation.mutate(noteId, {
      onSuccess: () => {
        notifyRestored();
        goBack();
      },
      onError: () => {
        notifyError();
      },
    });
  };

  return (
    <div className="bg-custom_01 h-full w-3/5 p-10 flex flex-col gap-3 items-center justify-center">
      <img src={restoreIcon} alt="" className="h-20" />
      <p className="font-custom text-3xl text-center text-white">Restore {}</p>
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
