import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import FullBody from "./components/FullBody";
import CenterBar from "./components/CenterBar";
import LeftSideBar from "./components/LeftSideBar/LeftSideBar";
import { ClassNames } from "@emotion/react";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Navigate to={"/project/"} />} /> */}
        <Route path="/*" element={<FullBody />} />
        <Route path="/folder/:folderId/note/:noteId" element={<FullBody />} />
        <Route path="/folder/:folderId" element={<FullBody />} />
        {/* <Route path="/" element={<Navigate to="/" />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
