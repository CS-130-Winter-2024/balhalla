import * as three from "three";
import { getSocket } from "./Connection";
import * as constants from "../constants"

var camera;
var properties = {
  x: 0,
  y: constants.ALIVE_Y,
  z: 0,
  directionHeld: [0, 0, 0, 0],
  hasBall: false,
};

var locked = false; //Locked = First Person Cam; Unlocked = Mouse Movement
let movementSpeed = 1;
var movementVector = new three.Vector3();
var perpVector = new three.Vector3();
var intermediateVector = new three.Vector3();
var prevCamVector = new three.Vector3();

var dashScalar = 1;
var dashAvailable = true;

export function changeMovementSpeed(speed) {
  movementSpeed = speed;
}
function calculateDirection() {
  camera.getWorldDirection(prevCamVector);
  camera.getWorldDirection(movementVector);
  camera.getWorldDirection(perpVector);
  // Forward and Back movement calculation
  movementVector.multiplyScalar(
    (properties.directionHeld[0] - properties.directionHeld[2]) * movementSpeed,
  );
  // Side to Side movement calculation
  perpVector.set(
    -perpVector.z * (properties.directionHeld[3] - properties.directionHeld[1]) * movementSpeed,
    0,
    perpVector.x * (properties.directionHeld[3] - properties.directionHeld[1]) * movementSpeed,
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
        constants.MESSAGES.sendMovement,
        { direction: [movementVector.x * dashScalar, movementVector.z * dashScalar] },
      ]),
    );
    canSend = false;
    setTimeout(() => {
      canSend = true;
    }, constants.UPDATE_RATE);
  }
}

function onClick() {
  if (locked && properties.hasBall) {
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
  // callback is sendMovement(vector) from Connection.jsx
  if (locked) {
    let wasMovement = false;

    if (e.key in constants.MOVEMENT_MAP) {
      let index = constants.MOVEMENT_MAP[e.key];
      wasMovement = properties.directionHeld[index] == 0;
      properties.directionHeld[index] = 1;
    }

    if (e.key == "Shift"){
      if (dashAvailable){
        wasMovement = true;
        dashScalar = constants.DASH_SPEED;
        // will jump the player in their moving direction
  
        dashAvailable = false;
        setTimeout(() => {
          dashAvailable = true;
        }, constants.DASH_COOLDOWN);
      }
      else{
        wasMovement = true;
        dashScalar = 1;
      }
      
    }

    if (wasMovement) {
      calculateDirection();
      sendMovement(dashScalar==constants.DASH_SPEED);
    }
  }
}

function onKeyUp(e) {
  // callback is sendMovement(vector) from Connection.jsx
  if (locked) {
    let wasMovement = false;

    if (e.key in constants.MOVEMENT_MAP) {
      let index = constants.MOVEMENT_MAP[e.key];
      wasMovement = true;
      properties.directionHeld[index] = 0;
    } else if (e.key == "f") {
      onClick();
    }

    if (dashScalar > 1){
      wasMovement = true;
      dashScalar = 1;
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
  // document.addEventListener("mousedown", onClick);
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
  camera.zoom = 1;
  camera.lookAt(0, 0, 5);
  camera.updateProjectionMatrix();
  return camera;
}

export function getCamera() {
  return camera;
}

export function updatePlayer(data) {
  properties = {
    ...properties,
    ...data,
  };
}

export function update() {
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
