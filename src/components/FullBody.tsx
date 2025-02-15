import LeftSideBar from "./LeftSideBar/LeftSideBar";
import CenterBar from "./CenterBar/NotesListView";
import NoteView from "./RightSideBar/NoteView";
import RightSideBar from "./RightSideBar/RightSideBar";

import { ClassNames } from "@emotion/react";
import { Route, Routes } from "react-router-dom";
import SelectNoteView from "./RightSideBar/selectNoteView";
import NotesListView from "./CenterBar/NotesListView";
import SelectFolderView from "./CenterBar/SelectFolderView";
import AddNewNotePage from "./RightSideBar/NewNoteView";

export default function FullBody() {
  return (
    <div className="flex h-screen w-screen bg-white">
      <Routes>
        {/* <Route path="/" element={<Navigate to={"/project/"} />} /> */}
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
              <CenterBar />
              <NoteView />
            </>
          }
        />
        <Route
          path="/folder/:folderId/note/newNote"
          element={
            <>
              <LeftSideBar />
              <CenterBar />
              <AddNewNotePage />
            </>
          }
        />
        {/* <Route path="/" element={<Navigate to="/" />} /> */}
      </Routes>
    </div>
  );
}
