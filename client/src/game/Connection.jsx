import { addPlayer } from "./OtherPlayers";

export const MESSAGES = {
  sendKey: "a", //server<-client
  serverUpdate: "b", //server->client
  playerJoin: "c", //server<->client
  playerLeave: "d", // server->client
  playerList: "e", // server->client
  gameStart: "f", // server->client
  playerKnockout: "g", //server->client
  knockedOut: "h", //server->client
  gameEnd: "i", //server->client
};

var socket;

var handlers = {
  open: (socket, event) => {
    socket.send("Joins Servers!"); //This needs to be server join logic
  },
  a: (socket, event) => {
    print("A");
  },
  b: (socket, event) => {
    print("B");
  },
  c: (socket, event) => {
    print("C");
  },
  d: (socket, event) => {
    print("D");
  },
  e: (socket, event) => {
    print("E");
  },
  f: (socket, event) => {
    print("F");
  },
  g: (socket, event) => {
    print("G");
  },
  h: (socket, event) => {
    print("H");
  },
  i: (socket, event) => {
    print("I");
  },
};

export function setupConnection() {
  socket = new WebSocket("wss://" + location.host + "/");

  socket.addEventListener("open", (event) => {
    handlers["open"](socket, event);
  });

  socket.addEventListener("error", (event) => {
    alert("Socket error!");
  });

  socket.addEventListener("close", (event) => {
    alert("Socket closed!");
  });

  socket.addEventListener("message", (event) => {
    console.log(event);
    console.log("Message from server ", event.data);
  });
}

export function setHandler(handler, callback) {
  handlers[handler] = callback;
}
