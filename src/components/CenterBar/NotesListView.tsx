import { useParams } from "react-router-dom";
import { Note, useFetchFolderNotes } from "../../api/apiAxios";
import { NavLink } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

export default function NotesListView({ title }: { title: string }) {
  const { folderId } = useParams() as {
    folderId: string;
  };
  const [currnNotes, setCurrentNotes] = useState<Note[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [folderRoute, setFolderRoute] = useState("");
  const {
    data: notes,
    isLoading,
    isError,
    error,
  } = useFetchFolderNotes({ folderId, pageNo });

  const { noteId } = useParams();

  const folderName =
    folderId === "favoriteNotes"
      ? "Favorite Notes"
      : folderId === "archivedNotes"
      ? "Archived Notes"
      : folderId === "trashNotes"
      ? "Trash Notes"
      : currnNotes && currnNotes.length > 0
      ? currnNotes[0]?.folder?.name
      : "Selected Folder is Empty";

  useEffect(() => {
    setPageNo(1);
    setCurrentNotes([]);
    const newFolderName =
      folderId === "favoriteNotes"
        ? "favoriteNotes"
        : folderId === "archivedNotes"
        ? "archivedNotes"
        : folderId === "trashNotes"
        ? "trashNotes"
        : folderId;
    setFolderRoute(newFolderName);
  }, [folderId]);

  useEffect(() => {
    if (notes?.notes) {
      // console.log(note)
      // setCurrentNotes((prev) => [...prev, ...notes.notes]);
      setCurrentNotes((prev) => {
        if (
          folderId === "archivedNotes" ||
          folderId === "favoriteNotes" ||
          folderId === "trashNotes"
        ) {
          return [...notes.notes];
        }
        const combinedNotes =
          notes.PageNo == 1 ? [...notes.notes] : [...prev, ...notes.notes];

        // Use a Map to keep only unique notes by id
        const uniqueNotes = Array.from(
          new Map(combinedNotes.map((note) => [note.id, note])).values()
        );
        return uniqueNotes;
      });
    }
  }, [notes]);

  const handleLoadMore = () => {
    setPageNo((prevPage) => prevPage + 1);
  };

  if (isLoading && pageNo == 1)
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
              size={15}
              thickness={6}
            />
          </Box>
          <p className="font-custom text-lg text-white px-2">Loading Notes </p>
        </div>
        <div className="rounded-sm p-3 flex flex-col gap-1.5">
          {[...Array(Math.round(Math.random() * 10) + 3)].map(() => (
            <div className="bg-custom_01 h-7"></div>
          ))}
        </div>
      </div>
    );
  if (isError)
    return (
      <div className="bg-custom_02 h-full w-1/5 py-5 flex flex-col gap-2">
        <p className="font-custom text-lg text-white px-4">
          Error fetching notes {error?.message || "Unknown error"}
        </p>
      </div>
    );

  return (
    <div className="bg-custom_02 h-full w-1/5 py-5 flex flex-col gap-2 ">
      {/* Header Text  */}
      <p className="font-custom text-lg text-white px-4">{folderName}</p>

      {/* All Current Shown Notes  */}
      <ul className="flex flex-col gap-1.5 px-4 py-2 h-full overflow-y-auto">
        {currnNotes !== undefined &&
          currnNotes.length > 0 &&
          currnNotes.map((note) => (
            <li key={note.id}>
              <NavLink
                // to={`/folder/${note.folderId}/note/${note.id}`}
                to={`/folder/${folderRoute}/note/${note.id}`}
                // onClick={() => handleChangeTitle(note ? note.title : "")}
                className={` rounded-sm p-3 flex flex-col gap-1.5 hover:bg-gray-800 ${
                  note.id === noteId ? "active" : "bg-custom_03"
                }`}
              >
                <div>
                  {/* Note Title  */}
                  {/* <p className="text-white font-custom ">{note.title}</p> */}
                  <p className="text-white font-custom style-none ">
                    {note.id === noteId ? title : note.title}
                    {/* {noteTitle} */}
                  </p>
                  {/* Date and Contain...  */}
                  <div className="flex h-5 justify-between">
                    <p className="font-custom text-sm text-white opacity-40">
                      {note.createdAt.substring(0, 10)}
                    </p>
                    <p className="font-custom text-sm text-white opacity-60">
                      {note.preview.substring(0, 15).concat("...")}
                    </p>
                  </div>
                </div>
              </NavLink>
            </li>
          ))}

        {notes?.totalNotes > currnNotes?.length && (
          <button
            onClick={handleLoadMore}
            className="flex justify-center font-custom text-white bg-custom_01 rounded-sm py-1 mt-2 hover:cursor-pointer items-center"
          >
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: " 0px",
                  width: "10px",
                }}
              >
                <CircularProgress
                  sx={{ color: "#ffffff" }}
                  size={10}
                  thickness={5}
                />
              </Box>
            ) : (
              ""
            )}
            <p className="ml-2">{`${
              isLoading ? "Loading Notes..." : "Load More Notes"
            } `}</p>
          </button>
        )}
      </ul>
    </div>
  );
}
