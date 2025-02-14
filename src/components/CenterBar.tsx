import { useParams } from "react-router-dom";
import { useFetchFolderNotes } from "../api/apiAxios";
import { NavLink } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CenterBar() {
  const { folderId } = useParams<string>();
  // console.log(folderId);
  const { data: notes, isLoading, isError } = useFetchFolderNotes({ folderId });
  const currnNotes = notes?.notes || [];
  const { noteId } = useParams();

  if (isLoading)
    return (
      <div className="bg-custom_02 w-1/5">
        <div className="  py-5 px-2 flex flex-row justify-center h-fit items-center">
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
          <p className="font-custom text-lg text-white px-2">Loading...</p>
        </div>
      </div>
    );
  if (isError)
    return (
      <div className="bg-custom_02 h-full w-1/5 py-5 flex flex-col gap-2">
        <p className="font-custom text-lg text-white px-4">
          Error fetching notes
        </p>
      </div>
    );

  if (!currnNotes?.length)
    return (
      <div className="bg-custom_02 h-full w-1/5 py-5 flex flex-col gap-2">
        <p className="font-custom text-lg text-white px-4">No Notes</p>
      </div>
    );

  return (
    <div className="bg-custom_02 h-full w-1/5 py-5 flex flex-col gap-2">
      {/* Header Text  */}
      <p className="font-custom text-lg text-white px-4">Personal</p>

      {/* All Current Shown Notes  */}
      <ul className="flex flex-col gap-1.5 px-4 h-full overflow-y-auto">
        {currnNotes.map((note) => (
          <li key={note.id}>
            <NavLink
              to={`/folder/${note.folderId}/note/${note.id}`}
              className={` rounded-sm p-3 flex flex-col gap-1.5  ${
                note.id === noteId ? "active" : "hover:bg-gray-800 bg-custom_03"
              }`}
            >
              {/* Note Title  */}
              <p className="text-white font-custom ">{note.title}</p>
              {/* Date and Contain...  */}
              <div className="flex h-5 justify-between">
                <p className="font-custom text-sm text-white opacity-40">
                  {note.createdAt.substring(0, 10)}
                </p>
                <p className="font-custom text-sm text-white opacity-60">
                  {note.preview.substring(0, 15).concat("...")}
                </p>
              </div>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
