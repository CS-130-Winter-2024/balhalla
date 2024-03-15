import * as constants from "../constants"

var socket;

var handlers = {
  open: (socket, event) => {
    // connects to server and waits to join to game
    socket.send("Joins Servers!");
  },
};
const URL = (import.meta.env.MODE == "development" && "ws://" + location.host + "/") || "wss://" + location.host + "/";

/**
 * Sets up the WebSocket connection and registers event handlers for various WebSocket events.
 */
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
    constants.set_global("DISCONNECTED",true)
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

/**
 * Returns the WebSocket instance used for the connection.
 */
export function getSocket() {
  return socket;
}

/**
 * Registers a callback function for a specific handler.
 *
 * @param {string} handler - The name of the handler for which the callback should be registered.
 * @param {Function} callback - The callback function to be executed when the handler is triggered.
 */
export function setHandler(handler, callback) {
  handlers[handler] = callback;
}
