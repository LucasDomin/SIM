import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ConsentProvider } from "./contexts/ConsentContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConsentProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ConsentProvider>
  </StrictMode>
);
