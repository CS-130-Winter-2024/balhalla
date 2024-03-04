import { useEffect, useState } from "react";
import "./ui.css";
import crosshair from "./crosshair.svg";
import Button from '@mui/material/Button';


export default function UI({}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [username, setUsername] = useState("Hello World");
  useEffect(() => {
    document.addEventListener("lock", () => {
      setShowOverlay(true);
    });
    document.addEventListener("unlock", () => {
      setShowOverlay(false);
    });
    document.addEventListener("setUsername", (e) => {
      setUsername(e.detail);
    });
  }, []);

  return (
    <>
      <div id="UI" style={{ display: (showOverlay && "none") || "block" }}>
        <h1 id="logo">Balhalla</h1>
        <h2>{username}</h2>
        
        <Button variant="contained" id="logIn">Return to Game</Button>
        <Button variant="outlined" id="logIn">Log In</Button>
        <Button variant="outlined" id="logIn">Sign Up</Button>
      </div>
      <div
        id="crosshair"
        style={{ display: (showOverlay && "block") || "none" }}
      >
        <img src={crosshair} width={50} height={50} />
      </div>
    </>
  );
}
