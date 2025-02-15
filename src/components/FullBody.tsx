import LeftSideBar from "./LeftSideBar/LeftSideBar";
import NoteView from "./RightSideBar/NoteView";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SelectNoteView from "./RightSideBar/SelectNoteView";
import NotesListView from "./CenterBar/NotesListView";
import SelectFolderView from "./CenterBar/SelectFolderView";
import AddNewNotePage from "./RightSideBar/NewNoteView";
import RestoreNoteView from "./RightSideBar/RestoreNoteView";

export default function FullBody() {
  const url = useLocation();
  return (
    <div className="flex h-screen w-screen bg-white">
      <Routes>
        {/* <Route path="/" element={<Navigate to={"/project/"} />} /> */}

        <Route
          path="/folder/:folderId"
          element={
            <>
              <LeftSideBar />
              <NotesListView />
              <SelectNoteView />
            </>
          }
        />
        <Route
          path="/folder/:folderId/note/:noteId"
          element={
            <>
              <LeftSideBar />
              <NotesListView />
              <NoteView />
            </>
          }
        />
        <Route
          path="/folder/:folderId/note/newNote"
          element={
            <>
              <LeftSideBar />
              <NotesListView />
              <AddNewNotePage />
            </>
          }
        />

        {/* <Route
          path="/folder/:favoriteNotes"
          element={
            <>
              <LeftSideBar />
              <NotesListView />
              <SelectNoteView />
            </>
          }
        /> */}

        {/* <Route
          path="/folder/:favoriteNotes/note/:noteId"
          element={
            <>
              <LeftSideBar />
              <NotesListView />
              <NoteView />
            </>
          }
        /> */}

        <Route
          path="/folder/:folderId/note/:noteId/restore"
          element={
            <>
              <LeftSideBar />
              <NotesListView />
              <RestoreNoteView />
            </>
          }
        />

        {/* <Route
          path="/folder/trashNotes/note/:noteId"
          element={<Navigate to={`${url.pathname}/restore`} />}
        /> */}

        <Route
          path="/*"
          element={
            <>
              <LeftSideBar />
              <SelectFolderView />
              <SelectNoteView />
            </>
          }
        />
        {/* <Route path="/" element={<Navigate to="/" />} /> */}
      </Routes>
    </div>
  );
}
