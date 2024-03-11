
export const MINIMUM_PLAYERS = 1;

//times
export const LOBBY_LENGTH = 20000;
export const START_COUNTDOWN = 5000;
export const GAME_LENGTH = 20000; //game length in milliseconds
export const TICK_RATE = 50; //how often to update server in milliseconds
export const TICK_DT = 0.05; //tick rate in seconds

//speed
export const PLAYER_SPEED = 5;  //meters/second for players
export const BALL_SPEED = 15; //INITIAL BALL SPEED
export const BALL_GRAVITY = 9.8;
export const SPEED_DT = PLAYER_SPEED * TICK_DT;

//sizing
export const WORLD_HALF_WIDTH = 14.5; //POSITIVE Z is RED TEAM (TEAM 1), NEGATIVE Z is BLUE TEAM (TEAM 0)
export const WORLD_HALF_LENGTH = 10.5;
export const SPAWN_DISTANCE = 3; //maximum spawn distance from the edge
export const BALL_RADIUS = 0.25;
export const PLAYER_RADIUS = 0.5;
export const COLLISION_R2 = 0.5625;
export const PLAYER_HEIGHT = 2;

//TEMPORARY, UNTIL DATABASE/ITEM SELECTION DONE
export const TEMP_DEFAULT_BALL_MODEL_UNTIL_SELECT_BALL_IS_DONE = 2;
export const TEMP_DEFAULT_BALL_MODEL_UNTIL_SELECT_BODY_IS_DONE = 1;

// default data/format for the in-game player
//   all player data persistent between games is kept in metadata
export const BASE_PLAYER = {
    direction: [0, 0], //x,z
    x: 0,
    z: 0,
    alive: true,
    hasBall: true, //should be false, true in dev
};

export const MESSAGES = {
    sendMovement: "a", //server<-client DONE ON SERVER
    serverUpdate: "b", //server->client DONE ON SERVER
    playerJoin: "c", //server<->client DONE ON SERVER
    playerLeave: "d", // server->client DONE ON SERVER
    playerList: "e", // server->client DONE ON SERVER
    gameStart: "f", // server->client
    playerKnockout: "g", //server->client
    gameEnd: "h", //server->client
    throwBall: "i", //server->client
};

export function message_parse(msg) {
    let output = {}
    let data = JSON.parse(msg)
    output.type = data[0];
    console.log("[MESSAGE]",data)
    switch (data[0]) { //data[0] = type
        case MESSAGES.sendMovement:
            output.direction = data[1].direction
            break
        case MESSAGES.playerJoin:
            output.username = data[1].username
            output.ready = data[1].ready
            break
        case MESSAGES.throwBall:
            output.direction = data[1];
            output.x = data[1][0];
            output.y = data[1][1];
            output.z = data[1][2];
            break
    }
    return output
}

//shuffle a team into 2 sides;
export function assign_random(count) {
    let tiebreaker = (count % 2 == 1) && Math.floor(Math.random()*2) || 0
    let teamOneCount = Math.floor(count / 2) + tiebreaker
    let teamTwoCount = count - teamOneCount;
    var assignments = []
    for (let i = 0; i<count; i++) {
        let choice = Math.floor(Math.random()*2);
        if (choice == 1) {
            if (teamTwoCount > 0) {
                teamTwoCount--;
            } else {
                choice = 0;
            }
        } else {
            if (teamOneCount > 0) {
                teamOneCount--;
            } else {
                choice = 1;
            }
        }
        assignments.push(choice)
    }
    return [assignments, tiebreaker];
}