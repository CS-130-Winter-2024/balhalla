import { addPlayer } from "./OtherPlayers";

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
};

const sendMovementFormat = {
  direction: [0, 0], //x,z
};

var socket;

var handlers = {
  open: (socket, event) => {
    // connects to server and waits to join to game
    socket.send("Joins Servers!"); //This needs to be server join logic
  },
  a: (socket, event) => {
    // sendMovement msg (PRIORITY)
    // send movement vector to server so server can calculate movement
    print("A");
  },
  b: (socket, event) => {
    // serverUpdate msg (PRIORITY)
    // regular update on game status: player positions, etc.
    print("B");
  },
  c: (socket, event) => {
    // playerJoin msg (PRIORITY)
    // notify that another player has joined

    print("C");
  },
  d: (socket, event) => {
    // playerLeave msg (PRIORITY)
    // notify that another player has left
    print("D");
  },
  e: (socket, event) => {
    // playerList msg (PRIORITY)
    // shows list of connected players?
    print("E");
  },
  f: (socket, event) => {
    // gameStart msg
    print("F");
  },
  g: (socket, event) => {
    // playerKnockout msg
    print("G");
  },
  h: (socket, event) => {
    // knockedOut msg
    print("H");
  },
  i: (socket, event) => {
    // gameEnd msg
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
    let data = JSON.parse(event.data);
    console.log("[SERVER] %s", event.data);
    if (data[0] in handlers) {
      handlers[data[0]](socket, data);
    }
  });
}

export function sendMovement(vector) {
  socket.send(
    JSON.stringify([
      MESSAGES.sendMovement,
      { direction: [vector.x, vector.z] },
    ]),
  );
}

export function setHandler(handler, callback) {
  handlers[handler] = callback;
}
