const TICK_RATE = 50;

const MESSAGES = {
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

const PLAYER_SAMPLE = {
  keys: [0, 0, 0, 0, 0], //WASD + click held
  x: 0,
  z: 0,
  alive: true,
  hasBall: false,
};

const BALL_SAMPLE = {
  x: 0,
  y: 0,
  z: 0,
  velocity: [0, 0, 0],
  throwerID: [],
};

var state = [];
var serverRepeater;

var players = {}; //playerid associated
var playerKeys = {}; //playerid associated. separate so that keys are not communicated over signal
var balls = []; //no association

function processMessage(socket, message) {
  let data = JSON.parse(message);
  switch (data[0]) {
    case MESSAGES.sendKey:
      //store player keys
      playerKeys[data[1].id].keys[data[1].key] = data[1].isDown;
      break;
    case MESSAGES.playerJoin:
      //send list of players to newly joined players
      socket.send(JSON.stringify([MESSAGES.playerList, players]));
      break;
    case MESSAGES.playerLeave:
      //remove player from player list
      breakl;
  }
}

function doGameTick() {}

function startServer() {
  serverRepeater = setInterval(doGameTick, TICK_RATE);
}

function stopServer() {
  clearInterval(serverRepeater);
}
