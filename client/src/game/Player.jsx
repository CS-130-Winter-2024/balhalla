import * as three from "three";

var camera, player;

var properties = {
  x: 0,
  y: 0,
  z: 0,
};

export function attachKeybinds() {
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
}

function onKeyDown(e) {}

function onKeyUp(e) {}

export function createCamera() {
  camera = new three.PerspectiveCamera(75, 2, 0.1, 1000);
  camera.position.z = 25;
  camera.position.y = 10;
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

export function updatePlayer(properties) {}
