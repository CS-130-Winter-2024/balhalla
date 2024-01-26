import { useEffect, useState } from "react";
import "./ui.css";

export default function UI({}) {
  const [showOverlay, setShowOverlay] = useState(false);
  useEffect(() => {
    document.addEventListener("lock", () => {
      console.log("THIS IS A TEST");
      setShowOverlay(true);
    });
    document.addEventListener("unlock", () => {
      setShowOverlay(false);
    });
  }, []);

  return (
    <div id="UI" style={{ display: (showOverlay && "none") || "block" }}>
      <h1>Hello World</h1>
    </div>
  );
}
