import {TICK_RATE} from "../constants.js";
import * as lobby from "./states/lobbyState.js"
import * as dodgeball from "./states/dodgeballState.js"


var state = 0;
var states = [lobby,dodgeball]

//Stores the gameloop interval ID
var serverRepeater;

function setState(nextState, data) {
  if (state != nextState) {
    states[nextState].startState(data);
  }
  state = nextState;
}

// automatically starts next state when a state finishes
for (let st of states) {
  st.setFinishCallback(setState);
}

export function addPlayer(id) {
  states[state].addPlayer(id)
  
}

export function deletePlayer(id) {
  states[state].deletePlayer(id)
}

export function processMessage(id, message) {
  states[state].processMessage(id,message);
}

export function startServer() {
  states[state].startState();
  serverRepeater = setInterval(() => {
    states[state].doTick();
  }, TICK_RATE);
}

export function stopServer() {
  clearInterval(serverRepeater);
}
