import * as constants from "../../constants.js";
import { getConnections } from "../connection.js";
var playerQueue = {}

var gameStartTimer = Date.now() + constants.LOBBY_LENGTH;

var onFinish = ()=>{}

export function startState() {
    gameStartTimer = Date.now() + constants.LOBBY_LENGTH;
}

export function addPlayer(id) {
    let sockets = getConnections();
    let list = JSON.stringify([constants.MESSAGES.playerList,0, id, gameStartTimer]);
    sockets[id].send(list)
}

export function deletePlayer(id) {
    if (id in playerQueue) {
        delete playerQueue[id];
    }
}

//lobby logic
//join -> add to ready check
//join again -> remove from ready check
//no keyupdate
export function processMessage(id, message) {
    let data = constants.message_parse(message)
    switch (data.type) {
      case constants.MESSAGES.playerJoin:
        if (message.delete) {
            delete playerQueue[id]
            return
        }
        if (message.metaData != undefined) {
            playerQueue[id] = {
                username: data.username,
                body: constants.TEMP_DEFAULT_BALL_MODEL_UNTIL_SELECT_BODY_IS_DONE,
                ball: constants.TEMP_DEFAULT_BALL_MODEL_UNTIL_SELECT_BALL_IS_DONE,
                ...message.metaData
            };
            return;
        }
        playerQueue[id] = {
            username: data.username,
            body: constants.TEMP_DEFAULT_BALL_MODEL_UNTIL_SELECT_BODY_IS_DONE,
            ball: constants.TEMP_DEFAULT_BALL_MODEL_UNTIL_SELECT_BALL_IS_DONE,
        };
        break
    }
}

var prev = -1;
export function doTick() {
    if (playerQueue < constants.MINIMUM_PLAYERS) {
        gameStartTimer = Date.now() + constants.LOBBY_LENGTH;
        return;
    }
    if (Date.now() >= gameStartTimer) {

        //process data

        //TODO: validate player metadata
        //get username from token (DB function)
        //check skins against token (DB function)
        let data = {}
        data.players = playerQueue
        data.count = Object.keys(playerQueue).length
        console.log("[START]",data.players)
        onFinish(1,data)
        return
    }
    let calc = (gameStartTimer - Date.now())/1000
    if (Math.floor(calc) != prev) {
        console.log("[TIMER] %d seconds until start",calc);
        prev = Math.floor(calc);
    }
    
}

export function setFinishCallback(val) {
    onFinish = val;
}




