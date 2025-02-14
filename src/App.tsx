import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import FullBody from "./components/FullBody";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/folder/:folderId/note/:noteId" element={<FullBody />} />
        <Route path="/folder/:folderId" element={<FullBody />} />
        <Route path="/*" element={<FullBody />} />
        {/* <Route path="/" element={<Navigate to="/" />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
