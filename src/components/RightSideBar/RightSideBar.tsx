// import NoteView from "./NoteView";
// import { useNavigate, useParams } from "react-router-dom";
// import RestoreNoteView from "./RestoreNoteView";

// export default function RightSideBar() {
//   const { folderId } = useParams<{ folderId?: string }>();
//   // console.log(noteId);
//   const isNewNote = folderId === "trashNotes" ? true : false;
//   const navigate = useNavigate();

//   const goRestore = () => {
//     navigate(`/restore`); // Navigates back to the home route
//   };
//   if (isNewNote) {
//     // return <RestoreNoteView />;
//     goRestore();
//   }

//   // if (!noteId) return <selectNoteView />;

//   // return <NoteView />;
// }
