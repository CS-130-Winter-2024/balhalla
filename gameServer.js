const TICK_RATE = 50;
const TICK_DT = 0.05;
const SPEED = 5;
const WORLD_HALF_WIDTH = 14.5;
const WORLD_HALF_LENGTH = 10.5;
export const MESSAGES = {
  sendMovement: "a", //server<-client DONE ON SERVER
  serverUpdate: "b", //server->client DONE ON SERVER
  playerJoin: "c", //server<->client DONE ON SERVER
  playerLeave: "d", // server->client DONE ON SERVER
  playerList: "e", // server->client DONE ON SERVER

  gameStart: "f", // server->client
  playerKnockout: "g", //server->client
  knockedOut: "h", //server->client
  gameEnd: "i", //server->client
};

const PLAYER_SAMPLE = {
  direction: [0, 0], //x,z
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
  throwerID: "",
};

var state = [];

//Stores the gameloop interval ID
var serverRepeater;

var players = {}; //playerid associated
var playersMetadata = {}; //playerid associated
var balls = [];

export function processMessage(id, sockets, message) {
  let data = JSON.parse(message);
  switch (data[0]) {
    case MESSAGES.sendMovement:
      //store player keys
      players[id].direction = data[1].direction;
      break;
    case MESSAGES.playerJoin:
      //THIS BEHAVIOR NEEDS TO BE CHANGED LATER
      //add player to players list
      players[id] = {
        ...PLAYER_SAMPLE,
      };
      playersMetadata[id] = {
        username: data[1].username,
      };

      //send list of players to newly joined players
      sockets[id].send(
        JSON.stringify([MESSAGES.playerList, id, players, playersMetadata]),
      );

      //send new join to all other players
      for (let otherID in players) {
        if (id == otherID) continue;

        sockets[otherID].send(
          JSON.stringify([
            MESSAGES.playerJoin,
            id,
            players[id],
            playersMetadata[id],
          ]),
        );
      }
      break;
  }
}

export function deletePlayer(id) {
  delete players[id];
  delete playersMetadata[id];
}

export function doGameTick(sockets) {
  //Update Player movements
  for (const playerID in players) {
    let player = players[playerID];
    player.x += player.direction[0] * TICK_DT * SPEED;
    player.x = Math.min(Math.max(player.x,-WORLD_HALF_LENGTH),WORLD_HALF_LENGTH) //clamp world border

    player.z += player.direction[1] * TICK_DT * SPEED;
    player.z = Math.min(Math.max(player.z,-WORLD_HALF_WIDTH),WORLD_HALF_WIDTH) //clamp world border
  }

  //Update ball movements
  for (const ballID in balls) {
  }

  //Send update to everyone
  for (const socket in sockets) {
    sockets[socket].send(
      JSON.stringify([MESSAGES.serverUpdate, players, balls]),
    );
  }
}

export function startServer(sockets) {
  serverRepeater = setInterval(() => {
    doGameTick(sockets);
  }, TICK_RATE);
}

export function stopServer() {
  clearInterval(serverRepeater);
}
