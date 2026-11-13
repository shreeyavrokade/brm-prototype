import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import PasswordGate from "./components/auth/PasswordGate";
import "./index.css";
import { applyDocumentBranding } from "./config/brand";

applyDocumentBranding();

createRoot(document.getElementById("root")!).render(
  <PasswordGate>
    <App />
  </PasswordGate>
);
