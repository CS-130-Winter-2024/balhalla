import express from "express";
import * as url from "url";
import path from "path";
import { WebSocketServer } from "ws";
import {
  MESSAGES,
  processMessage,
  startServer,
  deletePlayer,
} from "./gameServer.js";

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

var connections = {};
//Websocket Server
const wss = new WebSocketServer({ server: httpServer, clientTracking: true });
wss.on("connection", function connection(ws) {
  //Generate ID for websocket
  let id = Math.floor(Math.random() * 100000);
  while (id in connections) {
    id = Math.floor(Math.random() * 100000);
  }
  connections[id] = ws;
  console.log("[CONNECT] ID:%d", id);

  ws.on("error", console.error); //errors don't happen :)

  ws.on("message", function message(data) {
    console.log("[MESSAGE] %s from %d", data, id);
    processMessage(id, connections, data);
  });

  ws.on("close", function close() {
    console.log("[DISCONNECT] ID:%d", id);
    deletePlayer(id);
    delete connections[id];
    //Notify every connected player
    for (let otherID in connections) {
      connections[otherID].send(JSON.stringify([MESSAGES.playerLeave, id]));
    }
  });
});
startServer(connections);
