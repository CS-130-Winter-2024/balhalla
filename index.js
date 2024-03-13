import express, { json } from "express";
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

/* Database Commands
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
  purchaseItem("admin", 21, 1);
});

*/

// app.get("/signup", (request, response, next) => {
//   printUsers(request, response, next);
// });

setHandler("msg", processMessage);
setHandler("connect", addPlayer);
setHandler("disconnect", deletePlayer);
setupWSS(httpServer); //setup websocket server
startServer(); //start game server
