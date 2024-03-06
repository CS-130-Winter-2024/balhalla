import * as three from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { createWorld, getSkybox } from "./World";
import { setupConnection, setHandler } from "./Connection";
import * as constants from "../constants"
import * as Others from "./OtherPlayers";
import * as Player from "./Player";
import * as Balls from "./Balls";
import { loadDefault } from "./Models";
import { createLobbyWorld } from "./LobbyWorld";

let currentScene;
let scene, renderer, camera, controls, locked;

function getUsername() {
  return prompt("What is your username?");
  // return "Player" + Math.floor(Math.random() * 1000);
}

// Defines how the game handles messages from server
function websocketSetup() {
  //On connect, send username
  setHandler("open", (socket) => {
    let usernm = getUsername();
    var eventMsg = JSON.stringify([constants.MESSAGES.playerJoin, { username: usernm }]);
    document.dispatchEvent(new CustomEvent("setUsername", { detail: usernm }));
    socket.send(eventMsg);
  });

  //On player list sent, add all players to scene
  setHandler(constants.MESSAGES.playerList, (socket, data) => {
    Others.setClientID(data.id);
    Player.updatePlayer(data.playerData[data.id]);
    for (let player in data.playerData) {
      if (player == data.id) continue;
      Others.addPlayer(player, data.playerData[player], data.metaData[player]);
    }
  });

  //On other player connect, add their data to scene
  setHandler(constants.MESSAGES.playerJoin, (socket, data) => {
    Others.addPlayer(data.id, data.playerData, data.metaData);
  });

  //On other player disconnect, remove their data from scene
  setHandler(constants.MESSAGES.playerLeave, (socket, data) => {
    Others.removePlayer(data.id);
  });

  //On server update, update scene
  setHandler(constants.MESSAGES.serverUpdate, (socket, data) => {
    Player.updatePlayer(data.playerData[Others.getClientID()]);
    Others.updatePlayers(data.playerData);
    Balls.updateBalls(data.ballData);
  });

  setupConnection();
}

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



export function switchToLobby() {
  if (currentScene) {
    // Clean up resources or perform any necessary actions before switching
    disposeOfResources(currentScene);
    scene.remove(currentScene);
  }
  currentScene = createLobbyWorld();
  scene.add(currentScene);
  let light = new three.PointLight(0xffffff, 3, 0, 0);
  scene.add(light);
  scene.add(new three.AmbientLight(0xffffff, 4));
  scene.add(Others.getPlayerModelGroup());
  Player.changeMovementSpeed(10000);
}

function disposeOfResources(scene) {
  // Add cleanup logic specific to your application
  // For example, you might dispose of geometries, materials, textures, etc.
  scene.children[0].traverse((object) => {
    if (object instanceof three.Mesh) {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => {
            material.dispose();
          });
        } else {
          object.material.dispose();
        }
      }
    }
  });
}

export function switchToGame() {
  if (currentScene) {
    // Clean up resources or perform any necessary actions before switching
    disposeOfResources(currentScene);
    scene.remove(currentScene);
  }
  currentScene = createWorld();
  scene.add(currentScene);
  Player.changeMovementSpeed(1);

  let light = new three.PointLight(0xffffff, 3, 0, 0);
  scene.add(light);
  scene.add(new three.AmbientLight(0xffffff, 4));
  scene.add(Others.getPlayerModelGroup());
  scene.add(Balls.getBallGroup());
}

export function initialize() {

  //establish scene and renderer
  scene = new three.Scene();
  scene.background = getSkybox();
  renderer = new three.WebGLRenderer({ antialias: true });
  renderer.domElement.id = "GameCanvas";
  document.body.appendChild(renderer.domElement);

  //load models
  loadDefault()
  //add camera
  camera = Player.createCamera();
  
  // Initial setup with the game scene
  switchToGame();

  //Add controls to camera
  controls = new PointerLockControls(camera, renderer.domElement);
  controls.connect();
  //Add camera locking
  locked = false;
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
  websocketSetup();

  //Attach player keybinds
  Player.attachKeybinds();

  //Update viewport whenever changed
  updateAspect(renderer, camera);
  window.addEventListener("resize", () => {
    updateAspect(renderer, camera);
  });

  //Render loop
  function animate(time) {
    Player.update();
    Others.update();
    Balls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}
