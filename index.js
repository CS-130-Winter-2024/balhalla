import express from "express";
import * as url from "url";
import path from "path";
import {
  processMessage,
  startServer,
  deletePlayer,
  addPlayer,
} from "./src/gameServer.js";
import { setHandler, setupWSS } from "./src/connection.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const app = express();

//Client Page Server
app.use(express.static(path.join(__dirname, "public")));

//API Server
app.use("/users", (req, res) => {
  res.status(200).send("GET HTTP method on user resource");
});

//Start HTTP Server
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});


setHandler("msg",processMessage);
setHandler("connect", addPlayer);
setHandler("disconnect", deletePlayer);
setupWSS(httpServer); //setup websocket server
startServer(); //start game server
