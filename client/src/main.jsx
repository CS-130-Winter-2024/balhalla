import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import game from "./Game.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>{true && <App />}</React.StrictMode>,
);

game();
