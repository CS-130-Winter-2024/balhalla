import * as three from "three";
import { getSocket, MESSAGES } from "./Connection";


const SPEED = 5; //units per second
const ALIVE_Y = 1.25;
const DEAD_Y = 5; // FIND CORRECT VALUE LATER

const RATE = 25; //max rate of sending movement updates to server

const MOVEMENT_MAP = {"w":0,"a":1,"s":2,"d":3}; //string enum for movement

var camera;
var properties = {
  x: 0,
  y: ALIVE_Y,
  z: 0,
  directionHeld: [0, 0, 0, 0],
};
var locked = false; //Locked = First Person Cam; Unlocked = Mouse Movement

var movementVector = new three.Vector3();
var perpVector = new three.Vector3();
var intermediateVector = new three.Vector3();
var prevCamVector = new three.Vector3();

function calculateDirection() {
  camera.getWorldDirection(prevCamVector);
  camera.getWorldDirection(movementVector);
  camera.getWorldDirection(perpVector);
  // Forward and Back movement calculation
  movementVector.multiplyScalar(
    properties.directionHeld[0] - properties.directionHeld[2],
  );
  // Side to Side movement calculation
  perpVector.set(
    -perpVector.z * (properties.directionHeld[3] - properties.directionHeld[1]),
    0,
    perpVector.x * (properties.directionHeld[3] - properties.directionHeld[1]),
  );
  movementVector.add(perpVector);
  movementVector.y = 0;
  movementVector.normalize();
}

var canSend = true;
function sendMovement(override = false) {
  if (canSend || override) {
    getSocket().send(
      JSON.stringify([
        MESSAGES.sendMovement,
        { direction: [movementVector.x, movementVector.z] },
      ]),
    );
    canSend = false;
    setTimeout(() => {
      canSend = true;
    }, RATE);
  }
}

function onKeyDown(e) {
  // callback is sendMovement(vector) from Connection.jsx
  if (locked) {
    let wasMovement = false;
    if (e.key in MOVEMENT_MAP) {
      let index = MOVEMENT_MAP[e.key];
      wasMovement = properties.directionHeld[index] == 0;
      properties.directionHeld[index] = 1;
    }

    if (wasMovement) {
      calculateDirection();
      sendMovement();
    }
  }
}

function onKeyUp(e) {
  // callback is sendMovement(vector) from Connection.jsx
  if (locked) {
    let wasMovement = false;
    if (e.key in MOVEMENT_MAP) {
      let index = MOVEMENT_MAP[e.key];
      wasMovement = true
      properties.directionHeld[index] = 1;
    }

    if (wasMovement) {
      calculateDirection();
      sendMovement();
    }
  }
}

export function attachKeybinds() {
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  document.addEventListener("lock", () => {
    locked = true;
    properties.directionHeld = [0, 0, 0, 0];
  });
  document.addEventListener("unlock", () => {
    locked = false;
    properties.directionHeld = [0, 0, 0, 0];
    calculateDirection();
    sendMovement(true);
  });
}

export function createCamera() {
  camera = new three.PerspectiveCamera(75, 2, 0.1, 1000);
  camera.position.z = properties.z;
  camera.position.y = properties.y;
  camera.position.x = properties.x;
  camera.zoom = 1.3;
  camera.lookAt(0, 0, 5);
  camera.updateProjectionMatrix();
  return camera;
}

export function getCamera() {
  return camera;
}

export function setPlayerPosition(x, z) {
  properties.x = x;
  properties.z = z;
}

export function updatePlayer() {
  if (locked) {
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
}
