import * as three from "three";
import { getSocket } from "./Connection";
import * as constants from "../constants"

var camera;
var spectateCamera;

var spectateAnim = 0

constants.set_global("SPECTATING",true)
var spectating = true

// Properties of the client's player in-game
var properties = {
  x: 0,
  y: constants.ALIVE_Y,
  z: 0,
  directionHeld: [0, 0, 0, 0],
  hasBall: false,
  alive: true
};

var movementVector = new three.Vector3();
var perpVector = new three.Vector3();
var intermediateVector = new three.Vector3();
var prevCamVector = new three.Vector3();

var dashScalar = 1; // always applied to movements, greater than 1 when dash is used
var dashAvailable = true; // based on dash cooldown, defines when dash can be used


let keybinds = {
  "w":0,
  "a":1,
  "s":2,
  "d":3
}

constants.add_listener("KEYBINDS",(newBinds)=>{
  keybinds = {};
  keybinds[newBinds.Forward] = 0;
  keybinds[newBinds.Left] = 1;
  keybinds[newBinds.Backward] = 2;
  keybinds[newBinds.Right] = 3;
})

// Uses camera direction and movement key presses to determine player's movement direction
function calculateDirection() {
  camera.getWorldDirection(prevCamVector);
  camera.getWorldDirection(movementVector);
  camera.getWorldDirection(perpVector);
  // Forward and Back movement calculation
  movementVector.multiplyScalar(
    (properties.directionHeld[0] - properties.directionHeld[2]),
  );
  // Side to Side movement calculation
  perpVector.set(
    -perpVector.z * (properties.directionHeld[3] - properties.directionHeld[1]),
    0,
    perpVector.x * (properties.directionHeld[3] - properties.directionHeld[1]),
  );
  movementVector.add(perpVector); // combining horizontal and vertical movements along arena
  movementVector.y = 0; // regardless of camera, player an only move along x and z axes
  movementVector.normalize(); // Must normalize movements because all players move at same speed
}

var canSend = true; // active when a message can be sent to server to avoid msg flooding, decided by UPDATE_RATE
function sendMovement(override = false) {
  if (spectating) return; // spectating if in lobby or dead, so can't move in that case
  if (canSend || override) { // override allows for dashing and unlocking to get past the UPDATE_RATE limit
    getSocket().send(
      JSON.stringify([
        constants.MESSAGES.sendMovement,
        { direction: [movementVector.x * dashScalar, movementVector.z * dashScalar] }, // always applies dashScalar, it is usually just 1
      ]),
    );
    canSend = false;
    // UPDATE_RATE decides how often we can send updates to server
    setTimeout(() => {
      canSend = true;
    }, constants.UPDATE_RATE);
  }
}

function throwBall() {
  if (constants.get_global("LOCKED") && properties.hasBall) { // can only throw ball if not in menu and if you are holding ball
    // sends camera direction to server to handle ball velocity
    camera.getWorldDirection(intermediateVector);
    getSocket().send(
      JSON.stringify([
        constants.MESSAGES.throwBall,
        [intermediateVector.x, intermediateVector.y, intermediateVector.z],
      ]),
    );
  }
}

function onKeyDown(e) {
  if (spectating) return;
  // callback is sendMovement(vector) from Connection.jsx
  if (constants.get_global("LOCKED")) {
    let wasMovement = false;

    if (e.key in keybinds) { // Movement keys: WASD
      let index = keybinds[e.key];
      wasMovement = properties.directionHeld[index] == 0;
      properties.directionHeld[index] = 1;
    }

    if (e.key == constants.get_global("KEYBINDS").Dash){ // dash should only trigger on key press, not release
      if (dashAvailable){
        wasMovement = true;
        dashScalar = constants.DASH_SPEED;
        // will fast forward the player in their moving direction
  
        // starting dash cooldown
        dashAvailable = false;
        setTimeout(() => {
          dashAvailable = true;
        }, constants.DASH_COOLDOWN);
      }
    }

    // Only calculating and sending movements to server when wasMovement is true.
    // wasMovement is true when the the movement keys are being pressed differently than before.
    // Avoids wasting time recalculating and resending the same movement vector over and over again.
    if (wasMovement) {
      calculateDirection();
      sendMovement(dashScalar==constants.DASH_SPEED);
    }
  }
}

function onKeyUp(e) {
  if (spectating) return;
  // callback is sendMovement(vector) from Connection.jsx
  if (constants.get_global("LOCKED")) {
    let wasMovement = false;

    if (e.key in keybinds) { // Movement keys: WASD
      let index = keybinds[e.key];
      wasMovement = true;
      properties.directionHeld[index] = 0;
    } else if (e.key == constants.get_global("KEYBINDS").Throw) {
      throwBall();
    }

    // resets dashScalar after dash is used
    if (dashScalar > 1){
      wasMovement = true;
      dashScalar = 1;
    }
    
    // Only calculating and sending movements to server when wasMovement is true.
    // wasMovement is true when the the movement keys are being pressed differently than before.
    // Avoids wasting time recalculating and resending the same movement vector over and over again.
    if (wasMovement) {
      calculateDirection();
      sendMovement();
    }
  }
}

export function attachKeybinds() {
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  constants.add_listener("LOCKED",(isLocked) =>{
    if (!isLocked) {
      properties.directionHeld = [0, 0, 0, 0];
      calculateDirection();
      sendMovement(true);
    }
  })
}

// default spectating camera for when player is dead or in lobby
function createSpectateCamera() {
  spectateCamera = new three.PerspectiveCamera(75, 2, 0.1, 1000);
  spectateCamera.position.z = 0;
  spectateCamera.position.y = 10;
  spectateCamera.position.x = 22;
  spectateCamera.zoom = 1;
  spectateCamera.lookAt(0, 0, 0);
  spectateCamera.updateProjectionMatrix();
}

// player in-game camera for when game is active and player is alive
export function createCamera(spectate = false) {
  camera = new three.PerspectiveCamera(75, 2, 0.1, 1000);
  camera.position.z = properties.z;
  camera.position.y = properties.y;
  camera.position.x = properties.x;
  camera.zoom = 1;
  camera.lookAt(0, 0, 5);
  camera.updateProjectionMatrix();
  createSpectateCamera();
  if (spectate) {
    return spectateCamera;
  }
  return camera;
}

export function setSpectate(value) {
  spectating = (value && true) || false;
  constants.set_global("SPECTATING",spectating);
  camera.updateProjectionMatrix();
  spectateCamera.updateProjectionMatrix();
}

export function getCamera(force=false) {
  if (spectating && !force) return spectateCamera;
  return camera;
}

export function getSpectateCamera() {
  return spectateCamera;
}

export function updatePlayer(data, force=false) {
  if (data && data.alive && properties.hasBall == false && data.hasBall && !force) {
    constants.set_global("ANNOUNCE","You picked up a weapon!");
  }
  properties = {
    ...properties,
    ...data,
  };
  if (force) {
    camera.position.set(properties.x,properties.y,properties.z);
  }
}

export function isAlive() {
  return properties.alive;
}

const twoPI = Math.PI * 2;
function updateSpectateCamera() {
  spectateAnim += 0.0025118; //pi/180, comes out to full rotation every 6s
  if (spectateAnim > twoPI) {
    spectateAnim = 0;
  }
  spectateCamera.position.x = Math.cos(spectateAnim) * 22;
  spectateCamera.position.z = Math.sin(spectateAnim) * 22;
  spectateCamera.lookAt(0, 0, 0);
}
export function update() {
  if (spectating) {
    updateSpectateCamera();
    return;
  }
  //if dotproduct between camera and previous camera vector < 0.9
  if (movementVector.length() > 0.5) {
    camera.getWorldDirection(intermediateVector);
    let dot = prevCamVector.dot(intermediateVector);
    if (dot < 0.95 && dot > 0.05) {
      //send update to server
      calculateDirection();
      sendMovement();
    }
  }

  intermediateVector.set(properties.x, properties.y, properties.z);
  camera.position.lerp(intermediateVector, 0.2);
}
