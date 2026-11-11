import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import PasswordGate from "./components/auth/PasswordGate";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <PasswordGate>
    <App />
  </PasswordGate>
);
