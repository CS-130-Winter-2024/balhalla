import React from "react";
import ReactDOM from "react-dom/client";

import "./main.css";
import UI from "./ui/UI";
import Store from "./ui/store.jsx";
import {initialize} from "./game/Game"; // Import GameManager instead of the previous Game.jsx



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UI />
  </React.StrictMode>,
);

initialize()