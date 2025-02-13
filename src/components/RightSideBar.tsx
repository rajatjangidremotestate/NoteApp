import threeDotIcon from "../assets/icons/ThreeDots.svg";
import dateIcon from "../assets/icons/date.svg";
import folderIcon from "../assets/icons/normalFolder.svg";
import { useFetchFolders, useFetchNote } from "../api/apiAxios";
import { useParams } from "react-router-dom";

export default function RightSideBar() {
  const { noteId } = useParams<{ noteId: string }>();
  const { data: note, isLoading, error } = useFetchNote(noteId ?? "");
  const { data: folders } = useFetchFolders();

  const Note = note?.note || [];
  const Folders = folders?.folders || [];

  // const folderName =
  const arr = Folders.filter((folder) => {
    if (folder.id === Note.folder.id) {
      return folder;
    }
    return;
  });
  const folderName = arr.length > 0 ? arr[0].name : "";

  // console.log(Note.content);

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
        <p className="font-custom text-3xl text-white">{Note.title}</p>
        <img src={threeDotIcon} alt="" className="h-6 hover:cursor-pointer" />
      </div>

      {/* Date and Folder Details */}
      <div className="flex flex-col gap-2.5">
        <div className="flex gap-3 items-center">
          <img src={dateIcon} alt="" className="h-4" />
          <p className="text-custom text-white opacity-50 text-sm">Date</p>
          <p className="text-custom text-white underline text-sm">
            {Note.createdAt.substring(0, 10)}
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
      <textarea
        name="textArea"
        id="textArea"
        className="text-white font-custom text-sm"
        disabled
      >
        {/* {Note.content} */}
      </textarea>
    </div>
  );
}
