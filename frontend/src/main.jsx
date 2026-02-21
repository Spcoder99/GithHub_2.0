import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authContext.jsx";
import "./index.css";
import ProjectRoutes from "./Routes.jsx";

// // 👉 ADD THIS (Right-click disable)
// document.addEventListener("contextmenu", (e) => e.preventDefault());

// document.addEventListener("keydown", (e) => {
//   if (e.key === "F12") e.preventDefault();
//   if (e.ctrlKey && e.shiftKey && e.key === "I") e.preventDefault();
//   if (e.ctrlKey && e.key === "u") e.preventDefault();
// });


createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <ProjectRoutes></ProjectRoutes>
      <Toaster toastOptions={{ style: { background: "#333", color: "#fff", borderRadius: "8px", padding: "12px 16px", }, success: { style: { background: "linear-gradient(to right, #00b09b, #96c93d)", color: "white", }, iconTheme: { primary: "white", secondary: "#00b09b", }, }, error: { style: { background: "linear-gradient(to right, #ff416c, #ff4b2b)", color: "white", }, iconTheme: { primary: "white", secondary: "#ff4b2b", }, }, }} position="top-center" reverseOrder={false} />   
    </BrowserRouter>
  </AuthProvider>
);
