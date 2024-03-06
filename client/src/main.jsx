import React from "react";
import ReactDOM from "react-dom/client";

import "./main.css";
import UI from "./ui/UI";
import Store from "./ui/store.jsx";
import game from "./game/Game.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <UI /> */}
    <h1>Your 3D Store</h1>
      <Store
        initialModelPath="../assets/models/goku.glb"
        nextModelPath="../assets/models/Viking.glb"
      />
  </React.StrictMode>,
);

game();
