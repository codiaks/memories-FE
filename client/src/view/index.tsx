import {
  Route, Routes, Navigate
} from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import App from "./app";
import AuthView from "./auth";
import "../index.css";
import { ToastContainer } from "react-toastify";
import axios from "axios";

export interface IViewProps {}

export default function View(props: IViewProps) {
  const auth = useAppSelector((state) => state.auth);
  axios.defaults.baseURL = "http://localhost:8000/";
  axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
  axios.defaults.headers.post["Content-Type"] = "application/json";

  return (
    <div className="h-full" id="view">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/auth/*" element={<AuthView />} />
        <Route path="/*" element={<App />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
