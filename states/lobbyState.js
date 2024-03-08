import * as constants from "../constants.js";
var playerQueue = {}


var onFinish = ()=>{}

export function startState(sockets) {
    
}

export function addPlayer(id, sockets) {

}

export function deletePlayer(id, sockets) {

}

//lobby logic
//join -> add to ready check
//join again -> remove from ready check
//no keyupdate
export function processMessage(id, sockets, message) {

}

export function doTick(sockets) {

}

export function setFinishCallback(val) {
    onFinish = val;
}




