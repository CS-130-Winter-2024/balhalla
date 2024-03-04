import * as constants from "../constants.js";

var players = {}; //playerid associated
var playersMetadata = {}; //playerid associated
var balls = {};

var onFinish = ()=>{}
//ON DEATH -> WHAT DO?
//  Set to spectate
//      Against original plan
//      Very easy
//  Do parkour. if you did it, you revive. if you didn't, you spectate
//      Makes backend consistent
//      Not against original plan
//      Fun!
//      Extra work for parkour
//  Have players interfere with the balls
//      Original plan
//      Very inconsistent backend (what to do with new joins?)
//      Possibly weird gameplay/strategies
export function addPlayer(id, sockets) {
    
}

export function deletePlayer(id, sockets) {
    delete players[id];
    delete playersMetadata[id];

    for (let otherID in sockets) {
        sockets[otherID].send(JSON.stringify([constants.MESSAGES.playerLeave, id]));
    }
}
//dodgeball logic
//join -> add to lobby
//when game starts
//  send playerlist (rename playerlist to gamestart)
//  send countdown
export function processMessage(id, sockets, message) {
    let data = constants.message_parse(message)
    switch (data.type) {
      case constants.MESSAGES.sendMovement:
        //store player keys
        players[id].direction = data.direction;
        break;
      case constants.MESSAGES.playerJoin:
        //add player to players list
        players[id] = {
          ...constants.BASE_PLAYER,
        };
        playersMetadata[id] = {
          username: data.username,
          body: 0
        };
  
        //send list of players to newly joined players
        sockets[id].send(
          JSON.stringify([constants.MESSAGES.playerList, id, players, playersMetadata]),
        );
  
        //send new join to all other players
        for (let otherID in players) {
          if (id == otherID) continue;
  
          sockets[otherID].send(
            JSON.stringify([
              constants.MESSAGES.playerJoin,
              id,
              players[id],
              playersMetadata[id],
            ]),
          );
        }
        break;
      case constants.MESSAGES.throwBall:
        if (players[id].hasBall) {
          //generate ball id
          let ballID = Math.floor(Math.random() * 100000);
          while (ballID in balls) {
            ballID = Math.floor(Math.random() * 100000);
          }
          players[id].hasBall = false;
          let normal = Math.sqrt(data.x*data.x+data.z*data.z);
          //the normal is for throwing to the right of the player
          balls[ballID] = {
            x: players[id].x - (data.z/normal)*0.3,
            y: 1.25,
            z: players[id].z + (data.x/normal)*0.3,
            velocity: data.direction.map((x) => x * constants.BALL_SPEED),
            throwerID: id,
            isGrounded: false,
          };
        }
        break;
    }
}


export function doTick(sockets) {
    // Split board into x-axis slices (increment by x, extends along z)
    let sections = {};
  
    //Update Ball physics
    for (const ballID in balls) {
      let ball = balls[ballID];
  
      if (!ball.isGrounded) {
        ball.velocity[1] -= constants.TICK_DT * constants.BALL_GRAVITY;
  
        ball.x += ball.velocity[0] * constants.TICK_DT;
        ball.y += ball.velocity[1] * constants.TICK_DT;
        ball.z += ball.velocity[2] * constants.TICK_DT;
  
        if (ball.y <= constants.BALL_RADIUS) {
          ball.velocity = [0, 0, 0];
          ball.y = constants.BALL_RADIUS;
          ball.isGrounded = true;
        }
  
        //check if ball in bounds
        if (
          ball.x < -constants.WORLD_HALF_LENGTH ||
          ball.x > constants.WORLD_HALF_LENGTH ||
          ball.z < -constants.WORLD_HALF_WIDTH ||
          ball.z > constants.WORLD_HALF_WIDTH
        ) {
          //BALL BEHAVIOR OUT OF BOUNDS
          ball.velocity = [0, 0, 0];
          ball.x = 0;
          ball.z = 0;
          ball.y = constants.BALL_RADIUS;
          ball.isGrounded = true;
        }
      }
  
      let lower = Math.floor(ball.x - constants.BALL_RADIUS);
      let upper = Math.floor(ball.x + constants.BALL_RADIUS);
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
      player.x += player.direction[0] * constants.SPEED_DT;
      player.x = Math.min(
        Math.max(player.x, -constants.WORLD_HALF_LENGTH),
        constants.WORLD_HALF_LENGTH,
      ); //clamp to world border
  
      player.z += player.direction[1] * constants.SPEED_DT;
      player.z = Math.min(
        Math.max(player.z, -constants.WORLD_HALF_WIDTH),
        constants.WORLD_HALF_WIDTH,
      ); //clamp to world border
  
      let possibleCollisons = {
        ...sections[Math.floor(player.x - constants.PLAYER_RADIUS)],
        ...sections[Math.floor(player.x + constants.PLAYER_RADIUS)],
      };
      for (const ballID in possibleCollisons) {
        //check z and y axis of player and ball
        let ball = balls[ballID];
        if (Math.abs(player.z - ball.z) <= constants.BALL_RADIUS + constants.PLAYER_RADIUS) {
          let dist =
            (player.x - ball.x) * (player.x - ball.x) +
            (player.z - ball.z) * (player.z - ball.z);
          if (dist <= constants.COLLISION_R2) {
            //player and ball collide
            if (ball.isGrounded && !player.hasBall && player.alive) {
              // pick up ball
              player.hasBall = true;
              delete balls[ballID];
              let lower = Math.floor(player.x - constants.PLAYER_RADIUS);
              let upper = Math.floor(player.x + constants.PLAYER_RADIUS);
              if (lower in sections && ballID in sections[lower]) {
                delete sections[lower][ballID];
              }
              if (upper in sections && ballID in sections[upper]) {
                delete sections[upper][ballID];
              }
            } else if (!ball.isGrounded && ball.y <= constants.PLAYER_HEIGHT + constants.BALL_RADIUS && ball.throwerID != playerID) {
              console.log("[HIT] Ball from ",ball.throwerID, " killed ", playerID);
              players[playerID].alive = false;
              players[playerID].hasBall = false;
              // LATER: if have ball, return ball to game
  
              ball.isGrounded = false;
              ball.velocity = [0, 0, 0];
              ball.y = constants.BALL_RADIUS;
  
              for (let otherID in players) {
                sockets[otherID].send(
                  JSON.stringify([constants.MESSAGES.playerKnockout, playerID, ball.throwerID]),
                );
              }
            }
          }
        }
      }
    }
  
    //Send update to everyone
    for (const socket in sockets) {
      sockets[socket].send(
        JSON.stringify([constants.MESSAGES.serverUpdate, players, balls]),
      );
    }
}

export function setFinishCallback(val) {
    onFinish = val;
}
