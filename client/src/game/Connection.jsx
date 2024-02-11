const MESSAGES = {
  sendKey: "a",
  serverUpdate: "b",
  playerJoin: "c",
  playerLeave: "d",
  playerList: "e",
  gameStart: "f",
  playerKnockout: "g",
  knockedOut: "h",
  gameEnd: "i",
};

var socket;

export default function setupConnection() {
  socket = new WebSocket("wss://" + location.host + "/");

  socket.addEventListener("open", (event) => {
    socket.send("Hello Server!");
  });

  socket.addEventListener("error", (event) => {
    alert("Socket error!");
  });

  socket.addEventListener("close", (event) => {
    alert("Socket closed!");
  });

  socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
  });
}
