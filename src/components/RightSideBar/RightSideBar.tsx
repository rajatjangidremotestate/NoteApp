import NoteView from "./NoteView";
import NewNoteView from "./NewNoteView";
import { useParams } from "react-router-dom";
// import { selectNoteView } from "./selectNoteView";

export default function RightSideBar() {
  const { noteId } = useParams<{ noteId?: string }>();
  // console.log(noteId);
  const isNewNote = noteId === "newNote" ? true : false; // Check if we are adding a new note

  if (isNewNote) {
    return <NewNoteView />;
  }

  // if (!noteId) return <selectNoteView />;

  return <NoteView />;
}
