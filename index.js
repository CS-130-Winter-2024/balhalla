import express from "express";
import * as url from "url";
import path from "path";
import { WebSocketServer } from "ws";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const app = express();

//Server client page
app.use(express.static(path.join(__dirname, "public")));

//Serve api
app.use("/users", (req, res) => {
  res.status(200).send("GET HTTP method on user resource");
});

//Start the server
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

//Server websocket

const wss = new WebSocketServer({ server: httpServer });
wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.send("something");
});
