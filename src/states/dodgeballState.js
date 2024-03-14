import * as constants from "../../constants.js";
import { getConnections } from "../connection.js";

import pkg from "../../db/database.cjs";
const { updatePoints, updateHits, updateWin, updateLoss, getPointsByUsernames } = pkg;

var players = {}; //playerid associated
var playersMetadata = {}; //playerid associated
var balls = {didChange:false};


var playersByName = {}
var playerPoints;

var gameStartTimer;
var gameEndTimer;

var onFinish = (newValue, data)=>{} //dont change this

export function startState(data) {
  let sockets = getConnections();
  //teams
  let assignments = constants.assign_random(data.count);
  let teams = assignments[0]
  let tiebreaker = assignments[1]
  //add all the readied players to the game
  let current = 0;
  let playerCount = [0,0]
  playersByName = {}
  for (const id in data.players) {

    //pick z coordinate
    let zVal = (teams[current]*2*constants.WORLD_HALF_WIDTH - constants.WORLD_HALF_WIDTH);
    zVal += Math.random()*3*(1-2*teams[current]);
    

    //get player index on team and total size of the team
    playerCount[teams[current]]++;
    let teamSize = (teams[current] == tiebreaker && Math.floor(teams.length/2)) || Math.ceil(teams.length/2)
    let currentPlayer = playerCount[teams[current]];
    //get X offset
    let xVal = (2*constants.WORLD_HALF_LENGTH/(teamSize+1))*currentPlayer - constants.WORLD_HALF_LENGTH;
    
    //create player object
    players[id] = {
      ...constants.BASE_PLAYER,
      x:xVal,
      z:zVal,
    };

    //give player metadata (obtained from client and verified against database)
    playersMetadata[id] = {
      ...data.players[id],
      team: teams[current],
      hits: 0,
    };
    playersByName[data.players[id].username] = id
    current++;
  }

  gameStartTimer = Date.now() + constants.START_COUNTDOWN;
  gameEndTimer = gameStartTimer + constants.GAME_LENGTH;

  getPointsByUsernames(Object.keys(playersByName)).then(
    (players)=>{playerPoints = players}
  )

  //propagate the playerlist to everyone
  for (const id in sockets) {
    const broadcast = JSON.stringify([constants.MESSAGES.gameStart, id, players, playersMetadata, gameStartTimer, gameEndTimer]);
    sockets[id].send(broadcast);
  }
}

function isGameOver() {
  let counts = [0,0];
  for (const id in players) {
    if (players[id].alive)
      counts[playersMetadata[id].team] += 1;
  }

  if (counts[0] == 0 || counts[1] == 0) {
    return ((counts[0] == 0) && 1) || 0
  }

  return -1;
}


export function endState() {
  let winner = 2; //0=team 1, 1=team2, 2=tie
  let mvp = -1; // ID of the current mvp player
  let teamOneAdvantage = 0;

  let mvpMax = 0; // current max number of hits in the current game
  for (const id in players) {
    if (players[id].alive) {
      // Only counts living players
      // Sums players' team score
      teamOneAdvantage += (1 - (playersMetadata[id].team * 2))
    }

    // whoever has the most hits is mvp, tiebreaker is who reached that number first
    if (playersMetadata[id].hits > mvpMax) {
      mvp = id;
      mvpMax = playersMetadata[id].hits;
    }
  }

  //calculate winner
  if (teamOneAdvantage > 0) {
    winner = 0 // TEAM 1
  } else if (teamOneAdvantage < 0) {
    winner = 1 // TEAM 2
  } else {
    winner = 2 // TIE
  }

  //credit points to players
  let points = {};
  let totalPoints = {};
  for (const id in playersMetadata){
    totalPoints[id] = 0;
    points[id] = playersMetadata[id].hits * 10;
    if (id == mvp){
      points[id] += 10;
    }
    if (playersMetadata[id].team == winner){
      points[id] += 50;
      updateWin(playersMetadata[id].username, 1)
    }
    else {
      updateLoss(playersMetadata[id].username, 1)
    }
    
    if (playersMetadata[id].username in playerPoints) {
      console.log("PLAYER FOUND!");
      totalPoints[id] = playerPoints[playersMetadata[id].username] + points[id];
    }

    // update points in database
    updatePoints(playersMetadata[id].username, points[id])
    // update hits in database
    updateHits(playersMetadata[id].username, playersMetadata[id].hits)
    
  }

  //wipe everything
  players = {};
  playersMetadata = {};
  balls = {};

  let sockets = getConnections();
  let newTime = Date.now() + constants.LOBBY_LENGTH + 250
  console.log("[PLAYERPOINTS]",playerPoints);
  for (const id in sockets) {
    const broadcast = JSON.stringify([constants.MESSAGES.gameEnd, winner, mvp, points[id], newTime, totalPoints[id]])
    sockets[id].send(broadcast);
  }

  onFinish(0,newTime);
}

//called when player joins. do nothing here (since they should only spectate if joining mid-game)
export function addPlayer(id) {
  let sockets = getConnections();
  let list = JSON.stringify([constants.MESSAGES.playerList, 1, id, players, playersMetadata, gameStartTimer, gameEndTimer, balls]);
  sockets[id].send(list);
}

export function deletePlayer(id) {
  let sockets = getConnections();
  if (id in players) {
    delete players[id];
    delete playersMetadata[id];

    for (let otherID in sockets) {
        if (otherID == id) continue;
        sockets[otherID].send(JSON.stringify([constants.MESSAGES.playerLeave, id]));
    }

    if (isGameOver() != -1) {
      endState();
    }
  } 
}
//dodgeball logic
//join -> add to lobby
//when game starts
//  send playerlist (rename playerlist to gamestart)
//  send countdown
export function processMessage(id, message) {
  if (!(id in players)) {
    return;
  }
  let data = constants.message_parse(message)
  switch (data.type) {
    case constants.MESSAGES.sendMovement:
      if (Date.now() < gameStartTimer) {
        //game has not started yet! Do not process anything!
        return;
      }
      //store player keys
      players[id].direction = data.direction;
      break;
    case constants.MESSAGES.throwBall:
      if (Date.now() < gameStartTimer) {
        //game has not started yet! Do not process anything!
        return;
      }
      if (players[id].hasBall) {
        //generate random ball id
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
          model: playersMetadata[id].ball || 2,
        };
        balls.didChange = true;
      }
      break;
  }
}

export function doTick() {

    if (Date.now() > gameEndTimer) {
      endState()
    }

    if (Date.now() < gameStartTimer) {
      //game has not started yet! Do not process anything!
      return;
    }

    let sockets = getConnections();
    // Split board into x-axis slices (increment by x, extends along z)
    let sections = {};
  
    //Update Ball physics
    for (const ballID in balls) {
      if (ballID == "didChange") continue;
      let ball = balls[ballID];
      
      //If the ball isn't grounded, apply velocity
      if (!ball.isGrounded) { // only mid-air balls should be moving
        ball.spin += 1;
        ball.velocity[1] -= constants.TICK_DT * constants.BALL_GRAVITY; // acceleration due to gravity
  
        // moves ball along its trajectory
        ball.x += ball.velocity[0] * constants.TICK_DT;
        ball.y += ball.velocity[1] * constants.TICK_DT;
        ball.z += ball.velocity[2] * constants.TICK_DT;
  
        // if ball hits the ground, it stops moving and can now be picked up
        if (ball.y <= constants.BALL_RADIUS) {
          ball.velocity = [0, 0, 0];
          ball.y = constants.BALL_RADIUS;
          ball.isGrounded = true;
        }
  
        //Check if ball is in bounds
        if (
          ball.x < -constants.WORLD_HALF_LENGTH ||
          ball.x > constants.WORLD_HALF_LENGTH ||
          ball.z < -constants.WORLD_HALF_WIDTH ||
          ball.z > constants.WORLD_HALF_WIDTH
        ) {
          //BALL BEHAVIOR OUT OF BOUNDS
          // resets ball to center of the arena for now
          ball.velocity = [0, 0, 0];
          ball.x = 0;
          ball.z = playersMetadata[ball.throwerID].team * 6 - 3;
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
      if (!(playerID in players)) {
        //i do not know why i have to add this
        continue;
      }
      let player = players[playerID];


      //move player according to their velocity
      player.x += player.direction[0] * (player.alive ? constants.SPEED_DT : constants.DEAD_SPEED_DT);
      player.x = Math.min(
        Math.max(player.x, -constants.WORLD_HALF_LENGTH ),
        constants.WORLD_HALF_LENGTH,
      ); //clamp to world border on X
  
      //move player according to their velocity
      player.z += player.direction[1] * (player.alive ? constants.SPEED_DT : constants.DEAD_SPEED_DT);
      if (player.alive){ // clamp to team's side if alive
        player.z = Math.min(
          Math.max(player.z, playersMetadata[playerID].team == 0 && -constants.WORLD_HALF_WIDTH || 0),
          playersMetadata[playerID].team * constants.WORLD_HALF_WIDTH,
        );
      } else { // if dead can move wherever
        player.z = Math.min(
          Math.max(player.z, -constants.WORLD_HALF_WIDTH),
          constants.WORLD_HALF_WIDTH,
        );
      }
      
  
      let possibleCollisons = { // dividing arena in sections to avoid unnecessary hit detection calculations
        ...sections[Math.floor(player.x - constants.PLAYER_RADIUS)],
        ...sections[Math.floor(player.x + constants.PLAYER_RADIUS)],
      };

      //check every ball in the same x-position slice for a collision
      //makes the m*n algorithm faster by bounding both m and n
      for (const ballID in possibleCollisons) {
        //check z and x axis of player and ball
        if (!(ballID in balls)) continue;
        let ball = balls[ballID];
        if (Math.abs(player.z - ball.z) <= constants.BALL_RADIUS + constants.PLAYER_RADIUS) {
          let dist =
            (player.x - ball.x) * (player.x - ball.x) +
            (player.z - ball.z) * (player.z - ball.z);
          if (dist <= constants.COLLISION_R2) {
            // When player and a ball collide
            if (ball.isGrounded) {
              if (player.alive  && !player.hasBall){
                // When ball is on ground and living player has no ball, player picks up ball
                player.hasBall = true;
                delete balls[ballID];
                balls.didChange = true
              // places the lower and upper edge of ball each into the arena divisions
                let lower = Math.floor(player.x - constants.PLAYER_RADIUS);
                let upper = Math.floor(player.x + constants.PLAYER_RADIUS);

                // removes ball from ball hit-detection search
                if (lower in sections && ballID in sections[lower]) {
                  delete sections[lower][ballID];
                }
                if (upper in sections && ballID in sections[upper]) {
                  delete sections[upper][ballID];
                }
              } else {
                // When ball is on ground and dead player touches it, player pushes ball in direction they are moving
                ball.x += player.direction[0] * constants.TICK_DT * constants.BALL_SHOVE_SPEED;
                ball.z += player.direction[1] * constants.TICK_DT * constants.BALL_SHOVE_SPEED;
              }

            } else if (!ball.isGrounded && player.alive && ball.y <= constants.PLAYER_HEIGHT + constants.BALL_RADIUS && ball.throwerID != playerID && playersMetadata[ball.throwerID].team != playersMetadata[playerID].team) {
              // When mid-air ball hits another player
              console.log("[HIT] Ball from ",ball.throwerID, " killed ", playerID);
              players[playerID].alive = false;
              players[playerID].hasBall = false;
              playersMetadata[ball.throwerID].hits++;

              

              // LATER: if have ball, return ball to game
  
              // puts the ball that hit the player back into the center of arena
              ball.isGrounded = false;
              ball.velocity = [0, 0, 0];
              ball.y = constants.BALL_RADIUS;
  
              // informs all players of this player knockout
              for (let otherID in players) {
                if (!(otherID in sockets)) continue;
                sockets[otherID].send(
                  JSON.stringify([constants.MESSAGES.playerKnockout, playerID, ball.throwerID]),
                );
              }

              if (isGameOver() != -1) {
                endState();
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
    balls.didChange = false;
}

export function setFinishCallback(val) {
    onFinish = val;
}
