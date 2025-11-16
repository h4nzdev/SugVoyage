import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthenticationProvider } from "./context/AuthenticationContext.jsx";
import { ReminderProvider } from "./context/ReminderContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthenticationProvider>
    <ReminderProvider>
      <App />
    </ReminderProvider>
  </AuthenticationProvider>
);
