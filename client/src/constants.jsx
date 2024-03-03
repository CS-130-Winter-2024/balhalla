// here we store universal constants
import viking from "../assets/models/Viking.glb"
//GAME
export const SPEED = 5;
export const ALIVE_Y = 1.25;
export const DEAD_Y = 5;

export const MOVEMENT_MAP = { w: 0, a: 1, s: 2, d: 3 };



//WEBSOCKETS ----------------
export const UPDATE_RATE = 25;
export const MESSAGES = {
    sendMovement: "a", //server<-client DONE ON CLIENT
    serverUpdate: "b", //server->client DONE ON CLIENT
    playerJoin: "c", //server<->client
    playerLeave: "d", // server->client
    playerList: "e", // server->client
    gameStart: "f", // server->client
    playerKnockout: "g", //server->client
    gameEnd: "h", //server->client
    throwBall: "i", //client->server
};

export function message_parse(msg) {
    let output = {}
    let data = JSON.parse(msg)
    output.type = data[0];
    switch (data[0]) { //data[0] = type
        case MESSAGES.serverUpdate:
            output.playerData = data[1]
            output.ballData = data[2]
            break
        case MESSAGES.playerJoin:
            output.id = data[1]
            output.playerData = data[2]
            output.metaData = data[3]
            break
        case MESSAGES.playerLeave:
            output.id = data[1]
            break
        case MESSAGES.playerList:
            output.id = data[1]
            output.playerData = data[2]
            output.metaData = data[3]
            break
        case MESSAGES.playerKnockout:
            output.target = data[1];
            output.killer = data[2];
            break
    }
    return output
}



//THREE.JS
export const DODGE_BALL_SIDES = 28;

export const MODEL_IDS = {
    "0": viking
}

// color constants themes
export const colors = {

    default: 0xffffff,
    floor: 0x333333,
    red: 0xff0000,
    green: 0x00ff00,
    blue: 0x0000ff,
    yellow: 0xffff00,
    orange: 0xffa500,
}