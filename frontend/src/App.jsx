import React from "react";
import Role from "./routes/Role";
import { BrowserRouter } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";

const App = () => {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Role />
      </BrowserRouter>
    </NotificationProvider>
  );
};

export default App;
