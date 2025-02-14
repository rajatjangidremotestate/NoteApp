import NoteView from "./NoteView";
import NewNoteView from "./NewNoteView";
import { useParams } from "react-router-dom";
import selectNotForViewIcon from "../../assets/icons/SelectNotForView.svg";
export default function RightSideBar() {
  const { noteId } = useParams<{ noteId?: string }>();
  // console.log(noteId);
  const isNewNote = noteId === "newNote" ? true : false; // Check if we are adding a new note

  if (isNewNote) {
    return <NewNoteView />;
  }

  if (!noteId)
    return (
      <div className="bg-custom_01 h-full w-3/5 p-10 flex flex-col gap-3 items-center justify-center">
        <img src={selectNotForViewIcon} alt="" />
        <p className="font-custom text-3xl text-white">Select a note to view</p>
        <p className="font-custom text-white">
          Choose a note from the list on the left to view its contents, or
          create a new note to add to your collection.
        </p>
      </div>
    );

  return <NoteView />;
}
