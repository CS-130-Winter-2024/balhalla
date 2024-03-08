import {TICK_RATE, MESSAGES} from "./constants.js";
import * as lobby from "./states/lobbyState.js"
import * as dodgeball from "./states/dodgeballState.js"


var state = 1;
var states = [lobby,dodgeball]
var connections;

//Stores the gameloop interval ID
var serverRepeater;

function setState(newValue, data) {
  if (state != newValue) {
    states[newValue].startState(connections, data);
  }
  state = newValue;
}

for (let st of states) {
  st.setFinishCallback(setState);
}

export function addPlayer(id, sockets) {
  connections = sockets
  states[state].addPlayer(id,sockets)
  
}

export function deletePlayer(id, sockets) {
  connections = sockets
  states[state].deletePlayer(id,sockets)
}

export function processMessage(id, sockets, message) {
  states[state].processMessage(id,sockets,message);
}

export function startServer() {
  serverRepeater = setInterval(() => {
    states[state].doTick(connections);
  }, TICK_RATE);
}

export function stopServer() {
  clearInterval(serverRepeater);
}
