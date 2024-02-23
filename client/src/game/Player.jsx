import * as three from "three";

var camera, player;

const speed = 5; //units per second
var properties = {
  x: 0,
  y: 1.5,
  z: 10,
  directionHeld: [0, 0, 0, 0],
};

var movementVector = new three.Vector3();
var perpVector = new three.Vector3();
var intermediateVector = new three.Vector3();
var locked = false;

var keybinds = [];

export function attachKeybinds(movementCallback) {
  document.addEventListener("keydown", (e) => {
    onKeyDown(e, movementCallback);
  });
  document.addEventListener("keyup", (e) => {
    onKeyUp(e, movementCallback);
  });
  document.addEventListener("lock", () => {
    locked = true;
    properties.directionHeld = [0, 0, 0, 0];
  });
  document.addEventListener("unlock", () => {
    locked = false;
    properties.directionHeld = [0, 0, 0, 0];
  });
}

function calculateDirection() {
  camera.getWorldDirection(movementVector);
  camera.getWorldDirection(perpVector);
  movementVector.multiplyScalar(
    properties.directionHeld[0] - properties.directionHeld[2],
  );
  perpVector.set(
    -perpVector.z * (properties.directionHeld[3] - properties.directionHeld[1]),
    0,
    perpVector.x * (properties.directionHeld[3] - properties.directionHeld[1]),
  );
  movementVector.add(perpVector);
  movementVector.y = 0;
  movementVector.normalize();
}

function onKeyDown(e, callback) {
  // callback is sendMovement(vector) from Connection.jsx
  if (locked) {
    let wasMovement = false;
    switch (e.key) {
      case "w":
        wasMovement = properties.directionHeld[0] == 0;
        properties.directionHeld[0] = 1;
        break;
      case "a":
        wasMovement = properties.directionHeld[1] == 0;
        properties.directionHeld[1] = 1;
        break;
      case "s":
        wasMovement = properties.directionHeld[2] == 0;
        properties.directionHeld[2] = 1;
        break;
      case "d":
        wasMovement = properties.directionHeld[3] == 0;
        properties.directionHeld[3] = 1;
        break;
    }

    if (wasMovement) {
      console.log("Movement!");
      calculateDirection();
      callback(movementVector);
    }
  }
}

function onKeyUp(e, callback) {
  // callback is sendMovement(vector) from Connection.jsx
  if (locked) {
    let wasMovement = false;
    switch (e.key) {
      case "w":
        properties.directionHeld[0] = 0;
        wasMovement = true;
        break;
      case "a":
        properties.directionHeld[1] = 0;
        wasMovement = true;
        break;
      case "s":
        properties.directionHeld[2] = 0;
        wasMovement = true;
        break;
      case "d":
        properties.directionHeld[3] = 0;
        wasMovement = true;
        break;
    }
    if (wasMovement) {
      calculateDirection();
      callback(movementVector);
    }
  }
}

export function createCamera() {
  camera = new three.PerspectiveCamera(75, 2, 0.1, 1000);
  camera.position.z = properties.z;
  camera.position.y = properties.y;
  camera.zoom = 1.3;
  camera.lookAt(0, 0, 5);
  camera.updateProjectionMatrix();
  return camera;
}

export function getCamera() {
  return camera;
}

export function getPlayer() {
  return player;
}

export function setPlayerPosition(x, z) {
  camera.position.set(x, properties.y, z);
  properties.x = x;
  properties.z = z;
  camera.updateProjectionMatrix();
  console.log(camera.position);
}

export function updatePlayer(dt) {
  if (locked) {
    intermediateVector.copy(movementVector);
    intermediateVector.multiplyScalar(dt * speed);
    camera.position.add(intermediateVector);
  }
  properties.x = camera.position.x;
  properties.z = camera.position.z;
}
