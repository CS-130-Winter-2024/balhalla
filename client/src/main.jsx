import React from "react";
import ReactDOM from "react-dom/client";

import "./main.css";
import UI from "./ui/UI";
import game from "./game/Game.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UI />
  </React.StrictMode>,
);

game();
