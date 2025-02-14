import NoteView from "./NoteView";
import NewNoteView from "./NewNoteView";
import { useParams } from "react-router-dom";
export default function RightSideBar() {
  const { noteId } = useParams<{ noteId?: string }>();
  // console.log(noteId);
  const isNewNote = noteId === "newNote" ? true : false; // Check if we are adding a new note

  if (isNewNote) {
    return <NewNoteView />;
  }

  if (!noteId)
    return (
      <div className="bg-custom_01 h-full w-3/5 p-10 flex flex-col gap-3">
        <p className="font-custom text-3xl text-white">No note selected</p>
      </div>
    );

  return <NoteView />;
}
