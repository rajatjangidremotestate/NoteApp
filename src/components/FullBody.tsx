import LeftSideBar from "./LeftSideBar/LeftSideBar";
import NoteView from "./RightSideBar/NoteView";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SelectNoteView from "./RightSideBar/SelectNoteView";
import NotesListView from "./CenterBar/NotesListView";
import SelectFolderView from "./CenterBar/SelectFolderView";
import AddNewNotePage from "./RightSideBar/NewNoteView";
import RestoreNoteView from "./RightSideBar/RestoreNoteView";
import { useState } from "react";

export default function FullBody() {
  // const url = useLocation();
  const [title, setTitle] = useState("Change Title");
  return (
    <div className="flex h-screen w-screen bg-white">
      <Routes>
        {/* <Route path="/" element={<Navigate to={"/project/"} />} /> */}

        <Route
          path="/folder/:folderId"
          element={
            <>
              <LeftSideBar title={title} setTitle={setTitle} />
              <NotesListView title={title} setTitle={setTitle} />
              <SelectNoteView />
            </>
          }
        />
        <Route
          path="/folder/:folderId/note/:noteId"
          element={
            <>
              <LeftSideBar title={title} setTitle={setTitle} />
              <NotesListView title={title} setTitle={setTitle} />
              <NoteView title={title} setTitle={setTitle} />
            </>
          }
        />

        <Route
          path="/folder/:folderId/note/:noteId/restore"
          element={
            <>
              <LeftSideBar title={title} setTitle={setTitle} />
              <NotesListView />
              <RestoreNoteView />
            </>
          }
        />

        <Route
          path="/*"
          element={
            <>
              <LeftSideBar title={title} setTitle={setTitle} />
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
