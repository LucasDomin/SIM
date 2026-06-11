import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { CMSProvider } from "./hooks/useCMS";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <CMSProvider>
        <App />
      </CMSProvider>
    </AuthProvider>
  </StrictMode>
);
