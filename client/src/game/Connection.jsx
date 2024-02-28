//on the left
export const MESSAGES = {
  sendMovement: "a", //server<-client DONE ON CLIENT
  serverUpdate: "b", //server->client DONE ON CLIENT
  playerJoin: "c", //server<->client
  playerLeave: "d", // server->client
  playerList: "e", // server->client

  gameStart: "f", // server->client
  playerKnockout: "g", //server->client
  knockedOut: "h", //server->client
  gameEnd: "i", //server->client
  throwBall: "j", //client->server
};

var socket;

var handlers = {
  open: (socket, event) => {
    // connects to server and waits to join to game
    socket.send("Joins Servers!");
  },
};
const URL = (import.meta.env.MODE == "development" && "ws://" + location.host + "/") || "wss://" + location.host + "/";

export function setupConnection() {
  socket = new WebSocket(URL);

  socket.addEventListener("open", (event) => {
    handlers["open"](socket, event);
  });

  socket.addEventListener("error", (event) => {
    console.log("Socket error!");
  });

  socket.addEventListener("close", (event) => {
    console.log("Socket closed!");
  });

  socket.addEventListener("message", (event) => {
    let data = JSON.parse(event.data);
    if (data[0] in handlers) {
      handlers[data[0]](socket, data);
    }
  });
}

export function getSocket() {
  return socket;
}

export function setHandler(handler, callback) {
  handlers[handler] = callback;
}
