const TICK_RATE = 50;
const TICK_DT = 0.05;
const SPEED = 5;
const BALL_SPEED = 10;
const WORLD_HALF_WIDTH = 14.5;
const WORLD_HALF_LENGTH = 10.5;
const BALL_RADIUS = 0.25;
const PLAYER_RADIUS = 0.5;

const COLLISION_R2 = 0.5625;

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
  throwBall: "j", //server->client
};

const PLAYER_SAMPLE = {
  direction: [0, 0], //x,z
  x: 0,
  z: 0,
  alive: true,
  hasBall: true,
};

const BALL_SAMPLE = {
  x: 0,
  y: 0,
  z: 0,
  velocity: [0, 0, 0],
  throwerID: "",
  isGrounded: true,
};

var state = [];

//Stores the gameloop interval ID
var serverRepeater;

var players = {}; //playerid associated
var playersMetadata = {}; //playerid associated
var balls = {};

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
    case MESSAGES.throwBall:
      if (players[id].hasBall) {
        //generate ball id
        let ballID = Math.floor(Math.random() * 100000);
        while (ballID in balls) {
          ballID = Math.floor(Math.random() * 100000);
        }
        players[id].hasBall = false;
        balls[ballID] = {
          x: players[id].x,
          y: 2,
          z: players[id].z,
          velocity: data[1].map((x) => x * BALL_SPEED),
          throwerID: id,
          isGrounded: false,
        };
      }
      break;
  }
}

export function deletePlayer(id) {
  delete players[id];
  delete playersMetadata[id];
}

export function doGameTick(sockets) {
  // Split board into x-axis slices (increment by x, extends along z)
  let sections = {};

  for (const ballID in balls) {
    let ball = balls[ballID];

    if (!ball.isGrounded) {
      ball.velocity[1] -= TICK_DT * 4;

      ball.x += ball.velocity[0] * TICK_DT;
      ball.y += ball.velocity[1] * TICK_DT;
      ball.z += ball.velocity[2] * TICK_DT;

      if (ball.y <= BALL_RADIUS) {
        ball.velocity = [0, 0, 0];
        ball.y = BALL_RADIUS;
        ball.isGrounded = true;
      }

      //check if ball in bounds
      if (
        ball.x < -WORLD_HALF_LENGTH ||
        ball.x > WORLD_HALF_LENGTH ||
        ball.z < -WORLD_HALF_WIDTH ||
        ball.z > WORLD_HALF_WIDTH
      ) {
        //CHANGE THIS LATER
        ball.velocity = [0, 0, 0];
        ball.x = 0;
        ball.z = 0;
        ball.y = BALL_RADIUS;
        ball.isGrounded = true;
      }
    }

    let lower = Math.floor(ball.x - BALL_RADIUS);
    let upper = Math.floor(ball.x + BALL_RADIUS);
    if (!(lower in sections)) {
      sections[lower] = {};
    }
    sections[lower][ballID] = true;
    if (!(upper in sections)) {
      sections[upper] = {};
    }
    sections[upper][ballID] = true;
  }
  //Update Player movements
  for (const playerID in players) {
    let player = players[playerID];
    player.x += player.direction[0] * TICK_DT * SPEED;
    player.x = Math.min(
      Math.max(player.x, -WORLD_HALF_LENGTH),
      WORLD_HALF_LENGTH,
    ); //clamp world border

    player.z += player.direction[1] * TICK_DT * SPEED;
    player.z = Math.min(
      Math.max(player.z, -WORLD_HALF_WIDTH),
      WORLD_HALF_WIDTH,
    ); //clamp world border

    let possibleCollisons = {
      ...sections[Math.floor(player.x - PLAYER_RADIUS)],
      ...sections[Math.floor(player.x + PLAYER_RADIUS)],
    };
    for (const ballID in possibleCollisons) {
      //check z and y axis of player and ball
      let ball = balls[ballID];
      if (Math.abs(player.z - ball.z) <= BALL_RADIUS + PLAYER_RADIUS) {
        let dist =
          (player.x - ball.x) * (player.x - ball.x) +
          (player.z - ball.z) * (player.z - ball.z);
        if (dist <= COLLISION_R2) {
          //player and ball collide
          if (ball.isGrounded && !player.hasBall && player.alive) {
            // pick up ball
            player.hasBall = true;
            delete balls[ballID];
            let lower = Math.floor(player.x - PLAYER_RADIUS);
            let upper = Math.floor(player.x + PLAYER_RADIUS);
            if (lower in sections && ballID in sections[lower]) {
              delete sections[lower][ballID];
            }
            if (upper in sections && ballID in sections[upper]) {
              delete sections[upper][ballID];
            }
          } else if (ball.y <= 2 + BALL_RADIUS && ball.throwerID != playerID) {
            players[playerID].alive = false;
            players[playerID].hasBall = false;
            // LATER: if have ball, return ball to game

            ball.isGrounded = false;
            ball.velocity = [0, 0, 0];
            ball.y = BALL_RADIUS;

            for (let otherID in players) {
              if (playerID == otherID) continue;
              sockets[otherID].send(
                JSON.stringify([MESSAGES.knockedOut, playerID, ball.throwerID]),
              );
            }
          }
        }
      }
    }
  }

  //Update ball movements

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
