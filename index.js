import express, { json } from "express";
import * as url from "url";
import path from "path";
import { WebSocketServer } from "ws";
import { processMessage, startServer, deletePlayer } from "./gameServer.js";
import { MESSAGES } from "./constants.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const app = express();

import pkg from "./db/database.cjs";
const { signup, login, getLeaderboardList, updatePoints, purchaseItem } = pkg;

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

// Database Commands
app.use(express.json());
app.post("/signup", (request, response, next) => {
  signup(request, response, next);
});
app.post("/login", (request, response, next) => {
  login(request, response, next);
});
app.get("/get_leaderboard", (request, response) => {
  getLeaderboardList(request, response);
});
app.get("/test", (req, res) => {
  purchaseItem('admin', 21, 1)
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
