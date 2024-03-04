import {TICK_RATE, MESSAGES} from "./constants.js";
import * as lobby from "./states/lobbyState.js"
import * as dodgeball from "./states/dodgeballState.js"


var state = 1;
var states = [lobby,dodgeball]

//Stores the gameloop interval ID
var serverRepeater;

function setState(newValue) {
  state = value;
}

for (let st of states) {
  st.setFinishCallback(setState);
}

export function addPlayer(id, sockets) {
  states[state].addPlayer(id,sockets)
}

export function deletePlayer(id, sockets) {
  states[state].deletePlayer(id,sockets)
}

export function processMessage(id, sockets, message) {
  states[state].processMessage(id,sockets,message);
}

export function startServer(sockets) {
  serverRepeater = setInterval(() => {
    states[state].doTick(sockets);
  }, TICK_RATE);
}

export function stopServer() {
  clearInterval(serverRepeater);
}
