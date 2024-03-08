import { useEffect, useState } from "react";
import "./ui.css";
import crosshair from "./crosshair.svg";
import Button from "@mui/material/Button";

function handleLogin() {
  setLoginClicked(true);
}
// CURRENTLY ONLY TESTING SIGNUP/LOGIN
async function handleSignup() {
  let admin = "test2";
  let pw = "12345";
  console.log(location);
  await fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: admin,
      password: pw,
    }),
  })
    .then((response) => {console.log("test"); return response.json()})
    .then((data) => console.log("signup data:", data));

  await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: admin,
      password: pw,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log("login token:", data.token));
}

function DisplayComponent() {
  return (
    <div>
      <h2>This is the displayed component!</h2>
      <p>Replace this with your desired content.</p>
    </div>
  );
}

export default function UI({}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [username, setUsername] = useState("Hello World");
  const [loginClicked, setLoginClicked] = useState(false);

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

        <Button
          variant="contained"
          id="logIn"
          onClick={() => {
            document.dispatchEvent(new CustomEvent("lock"));
          }}
        >
          Return to Game
        </Button>
        <Button variant="outlined" id="logIn" onClick={handleLogin}>
          Log In
        </Button>
        {loginClicked && <DisplayComponent />}
        <Button variant="outlined" id="logIn" onClick={handleSignup}>
          Sign Up
        </Button>
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
