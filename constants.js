export const TICK_RATE = 50;
export const TICK_DT = 0.05;
export const PLAYER_SPEED = 5;
export const BALL_SPEED = 15; //INITIAL BALL SPEED
export const BALL_GRAVITY = 9.8
export const SPEED_DT = PLAYER_SPEED * TICK_DT

export const WORLD_HALF_WIDTH = 14.5;
export const WORLD_HALF_LENGTH = 10.5;

export const BALL_RADIUS = 0.25;
export const PLAYER_RADIUS = 0.5;
export const COLLISION_R2 = 0.5625;
export const PLAYER_HEIGHT = 2;

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
    switch (data[0]) { //data[0] = type
        case MESSAGES.sendMovement:
            output.direction = data[1].direction
            break
        case MESSAGES.playerJoin:
            output.username = data[1].username
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