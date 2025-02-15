// ToastProvider.js
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showToast = (message, type = "success") => {
  if (type === "success") toast.success(message);
  else if (type === "error") toast.error(message);
  else if (type === "warning") toast.warn(message);
  else toast.info(message);
};

const ToastProvider = () => {
  return <ToastContainer position="top-right" autoClose={3000} />;
};

export { ToastProvider, showToast };
