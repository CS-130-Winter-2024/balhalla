import * as constants from "../../constants.js";
import { getConnections } from "../connection.js";
var playerQueue = {}

var gameStartTimer = Date.now() + constants.LOBBY_LENGTH;
var sentPause = false;

var onFinish = ()=>{}

export function startState(timer) {
    playerQueue = {};
    gameStartTimer = timer ? timer : Date.now() + constants.LOBBY_LENGTH;
}

export function addPlayer(id) {
    let sockets = getConnections();
    let list = JSON.stringify([constants.MESSAGES.playerList,0, id, gameStartTimer]);
    sockets[id].send(list)
    if (Object.keys(playerQueue).length < constants.MINIMUM_PLAYERS) {
        JSON.stringify([constants.MESSAGES.pauseClock, true,null]);
    }
}

export function deletePlayer(id) {
    if (id in playerQueue) {
        delete playerQueue[id];
        if (Object.keys(playerQueue).length < constants.MINIMUM_PLAYERS && !sentPause) {
            let sockets = getConnections()
            const broadcast = JSON.stringify([constants.MESSAGES.pauseClock, true,null])
            for (const socketID in sockets) {
                sockets[socketID].send(broadcast);
            }
            sentPause = true;
        }
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
        if (!data.ready) {
            delete playerQueue[id]
            if (Object.keys(playerQueue).length < constants.MINIMUM_PLAYERS && !sentPause) {
                let sockets = getConnections()
                const broadcast = JSON.stringify([constants.MESSAGES.pauseClock, true,null])
                for (const socketID in sockets) {
                    sockets[socketID].send(broadcast);
                }
                sentPause = true;
            }
            return
        }


        if (Object.keys(playerQueue).length == (constants.MINIMUM_PLAYERS - 1) && !(id in playerQueue) && sentPause) {
            gameStartTimer = Date.now() + constants.LOBBY_LENGTH;
            let sockets = getConnections()
            const broadcast = JSON.stringify([constants.MESSAGES.pauseClock, false,gameStartTimer])
            for (const socketID in sockets) {
                sockets[socketID].send(broadcast);
            }
            sentPause = false;
        }

        playerQueue[id] = {
            username: data.username,
            ball: data.ball,
            icon: data.icon,
            ready: data.ready,
        };
        if (data.pet) playerQueue[id].pet = data.pet

        
        break
    }
}

var prev = -1;
export function doTick() {
    if (Object.keys(playerQueue).length < constants.MINIMUM_PLAYERS) {
        return;
    }
    if (Date.now() >= gameStartTimer) {

        //process data

        //TODO: validate player metadata
        //get username from token (DB function)
        //check skins against token (DB function)
        let data = {}
        data.players = playerQueue
        data.count = Object.keys(data.players).length
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




