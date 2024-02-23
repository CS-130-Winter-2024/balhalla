import * as three from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { createWorld, getSkybox } from "./World";
import {
  setupConnection,
  setHandler,
  MESSAGES,
  sendMovement,
} from "./Connection";
import {
  getPlayerModelGroup,
  addPlayer,
  removePlayer,
  setClientID,
  getClientID,
  updatePlayers,
} from "./OtherPlayers";
import * as Player from "./Player";

function updateAspect(renderer, camera) {
  const canvas = renderer.domElement;
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // adjust displayBuffer size to match
  if (canvas.width !== width || canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

function getUsername() {
  return "Player" + Math.floor(Math.random() * 1000);
}

function websocketSetup(camera) {
  //On connect, send username
  setHandler("open", (socket) => {
    let usernm = getUsername();
    var eventMsg = JSON.stringify([MESSAGES.playerJoin, { username: usernm }]);
    document.dispatchEvent(new CustomEvent("setUsername", { detail: usernm }));
    socket.send(eventMsg);
  });

  //On player list sent, add all players to scene
  setHandler(MESSAGES.playerList, (socket, data) => {
    setClientID(data[1]);
    Player.setPlayerPosition(data[2][data[1]].x, data[2][data[1]].z);
    for (let player in data[2]) {
      if (player == data[1]) continue;
      addPlayer(player, data[2][player], data[3][player]);
    }
  });

  //On other player connect, add their data to scene
  setHandler(MESSAGES.playerJoin, (socket, data) => {
    addPlayer(data[1], data[2], data[3]);
  });

  //On other player disconnect, remove their data from scene
  setHandler(MESSAGES.playerLeave, (socket, data) => {
    removePlayer(data[1]);
  });

  //On server update, update scene
  setHandler(MESSAGES.serverUpdate, (socket, data) => {
    Player.setPlayerPosition(
      data[1][getClientID()].x,
      data[1][getClientID()].z,
    );
    updatePlayers(data[1], camera);
  });

  setupConnection();
}

export default function main() {
  //establish scene and renderer
  var scene = new three.Scene();
  scene.background = getSkybox();
  var renderer = new three.WebGLRenderer({ antialias: true });
  renderer.domElement.id = "GameCanvas";
  document.body.appendChild(renderer.domElement);

  //add camera
  var camera = Player.createCamera();

  //add world
  scene.add(createWorld());

  //add lights
  let light = new three.PointLight(0xffffff, 4, 0, 0);
  light.position.set(0, 20, 10);
  scene.add(light);

  //add other players
  scene.add(getPlayerModelGroup());

  //Add controls to camera
  var controls = new PointerLockControls(camera, renderer.domElement);
  controls.connect();
  //Add camera locking
  var locked = false;
  controls.addEventListener("lock", () => {
    document.dispatchEvent(new CustomEvent("lock"));
  });
  controls.addEventListener("unlock", () => {
    document.dispatchEvent(new CustomEvent("unlock"));
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key == " " || ev.key == "Enter") {
      if (locked) {
        controls.lock();
        locked = false;
      } else {
        controls.unlock();
        locked = true;
      }
    }
  });

  //setup websockets
  websocketSetup(camera);

  //Attach player keybinds
  Player.attachKeybinds(sendMovement);

  //Update viewport whenever changed
  updateAspect(renderer, camera);
  window.addEventListener("resize", () => {
    updateAspect(renderer, camera);
  });

  //Render loop
  var prev = 0;
  function animate(time) {
    renderer.render(scene, camera);
    Player.updatePlayer((time - prev) / 1000);
    prev = time;
    requestAnimationFrame(animate);
  }
  animate();
}
