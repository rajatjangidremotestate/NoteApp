import FullBody from "./components/FullBody";
import { ToastProvider } from "./components/ToastProvider";

function App() {
  return (
    <>
      <ToastProvider />
      <FullBody />
    </>
  );
}

export default App;
