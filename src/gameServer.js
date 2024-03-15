import { TICK_RATE } from "../constants.js";
import * as lobby from "./states/lobbyState.js";
import * as dodgeball from "./states/dodgeballState.js";

var state = 0;
var states = [lobby, dodgeball];

//Stores the gameloop interval ID
var serverRepeater;

/**
 * Function to set the state of the game to the next state and execute the corresponding startState function.
 * @function
 * @name setState
 * @param {string} nextState - The next state to transition to.
 * @param {any} data - Data to be passed to the startState function of the next state.
 */
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

/**
 * Function to add a player to the current game state.
 * @function
 * @name addPlayer
 * @param {string} id - The ID of the player to add.
 */
export function addPlayer(id) {
  states[state].addPlayer(id);
}

/**
 * Function to delete a player from the current game state.
 * @function
 * @name deletePlayer
 * @param {string} id - The ID of the player to delete.
 */
export function deletePlayer(id) {
  states[state].deletePlayer(id);
}

/**
 * Function to process a message for the current game state. Each state proecesses the message differently.
 * @function
 * @name processMessage
 * @param {string} id - The ID of the player sending the message.
 * @param {string} message - The message received from the player.
 */
export function processMessage(id, message) {
  states[state].processMessage(id, message);
}

/**
 * Function to start the game server with the current state and initiate game loop.
 * @function
 * @name startServer
 */
export function startServer() {
  states[state].startState();
  serverRepeater = setInterval(() => {
    states[state].doTick();
  }, TICK_RATE);
}

/**
 * Function to stop the game server by clearing the interval for game loop execution.
 * @function
 * @name stopServer
 */
export function stopServer() {
  clearInterval(serverRepeater);
}
