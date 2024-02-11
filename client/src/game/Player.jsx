import * as three from "three";

var camera, player;

const speed = 5; //units per second
var properties = {
  x: 0,
  y: 2,
  z: 10,
  directionHeld: [0, 0, 0, 0],
};

var movementVector = new three.Vector3();
var perpVector = new three.Vector3();
var locked = false;

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
  });
}

function onKeyDown(e) {
  if (locked) {
    switch (e.key) {
      case "w":
        properties.directionHeld[0] = 1;
        break;
      case "a":
        properties.directionHeld[1] = 1;
        break;
      case "s":
        properties.directionHeld[2] = 1;
        break;
      case "d":
        properties.directionHeld[3] = 1;
        break;
    }
  }
}

function onKeyUp(e) {
  if (locked) {
    switch (e.key) {
      case "w":
        properties.directionHeld[0] = 0;
        break;
      case "a":
        properties.directionHeld[1] = 0;
        break;
      case "s":
        properties.directionHeld[2] = 0;
        break;
      case "d":
        properties.directionHeld[3] = 0;
        break;
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

console.log("PERPVECTOR!", perpVector);
export function updatePlayer(dt) {
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
  if (locked) {
    camera.position.add(movementVector.multiplyScalar(dt * speed));
  }
  properties.x = camera.position.x;
  properties.z = camera.position.z;
}
