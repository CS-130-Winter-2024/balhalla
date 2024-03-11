// here we store universal constants
import viking from "../assets/models/Viking.glb"
import vikingboat from "../assets/models/VikingBoat.glb"
import axe from "../assets/models/weapons/Axe.glb"
import hammer from "../assets/models/weapons/Mjolnir.glb"
import trident from "../assets/models/weapons/Trident.glb"
import tree from "../assets/models/pets/Tree.glb"
import turtle from "../assets/models/pets/Turtle.glb"
import pig from "../assets/models/pets/Pig.glb"
import duck from "../assets/models/pets/Duck.glb"
import vikingghost from "../assets/models/VikingGhost.glb"

//GAME
export const SPEED = 5;
export const ALIVE_Y = 1.25;
export const DEAD_Y = 5;

export const THROW_KEY = "f"
export const MOVEMENT_MAP = { w: 0, a: 1, s: 2, d: 3 };

export const DASH_COOLDOWN = 5000;
export const DASH_SPEED = 15;

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
        case MESSAGES.playerList:
            if (data[1] == 0) {
                output.gameState = data[1]
                output.id = data[2]
                output.startTime = data[3]
            } else {
                output.gameState = data[1]
                output.id = data[2]
                output.playerData = data[3]
                output.metaData = data[4]
                output.startTime = data[5]
                output.endTime = data[6]
            }
            break
        case MESSAGES.gameStart:
            output.id = data[1]
            output.playerData = data[2]
            output.metaData = data[3]
            output.startTime = data[4]
            output.endTime = data[5]
            break
        case MESSAGES.gameEnd:
            output.winner = data[1]
            output.mvp = data[2]
            output.points = data[3]
            break
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
    "0": viking,
    "1": vikingboat,
    "2": axe,
    "3": hammer,
    "4": trident,
    "5": tree,
    "6": turtle,
    "7": pig,
    "8": duck,
    "9": vikingghost
}

export const BALL_ANIMATIONS = {
    // applies animations to a model based on its corresponding model ID
    "2": function(model) {
        model.rotation.x += 0.1
    },
    "3": function(model) {
        model.rotation.x += 0.03
    },
    "4": function(model) {
        model.rotation.y += 0.5 * Math.PI
        model.rotation.z = 0.5 * Math.PI
    },
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

var GLOBAL_STORE = {

}

var LISTENERS = {

}

export function add_listener(key,fun, repeat=true) {
    let index = 0;
    if (key in LISTENERS) {
        let last;
        for (x in LISTENERS[key]) {
            last = x;
        }
        index = Number(last) + 1;
        LISTENERS[key][index] = [fun,repeat];
    } else {
        LISTENERS[key] = {0:[fun,repeat]};
    }
    return index;
}

export function remove_listener(key, index) {
    if (key in LISTENERS && index in LISTENERS[key]) {
        delete LISTENERS[key][index]
    } else {
        console.error("Tried to remove listener",index,"from key",key,", but index does not exist");
    }
}

export function get_global(key) {
    if (key in GLOBAL_STORE) {
        return GLOBAL_STORE[key];
    }
    return null;
}

export function set_global(key,value) {
    GLOBAL_STORE[key] = value
    if (key in LISTENERS) {
        for (const fun in LISTENERS[key]) {
            LISTENERS[key][fun][0](value);
            if (!LISTENERS[key][fun][1]) {
                delete LISTENERS[key][fun]
            }
        }
    }
}