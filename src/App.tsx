import { BrowserRouter as Router } from "react-router-dom";
import FullBody from "./components/FullBody";
import { ToastProvider } from "./components/ToastProvider";

function App() {
  return (
    <Router>
      <ToastProvider />
      <FullBody />
    </Router>
  );
}

export default App;
