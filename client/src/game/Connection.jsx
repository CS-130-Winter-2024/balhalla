import * as constants from "../constants"

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
    location.reload();
  });

  socket.addEventListener("message", (event) => {
    let data = constants.message_parse(event.data);
    if (data.type != constants.MESSAGES.serverUpdate) {
      console.log("[MESSAGE]",data)
    }
    if (data.type in handlers) {
      handlers[data.type](socket, data);
    }
  });
}

export function getSocket() {
  return socket;
}

export function setHandler(handler, callback) {
  handlers[handler] = callback;
}
