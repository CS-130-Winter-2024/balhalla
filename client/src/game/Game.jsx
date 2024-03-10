import * as three from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { createWorld, getSkybox } from "./World";
import { setupConnection, setHandler } from "./Connection";
import * as constants from "../constants"
import * as Others from "./OtherPlayers";
import * as Player from "./Player";
import * as Balls from "./Balls";
import { loadDefault } from "./Models";

function getUsername() {
  //return prompt("What is your username?");
  return "Guest " + Math.floor(Math.random() * 1000);
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
    constants.set_global("CLIENT_ID",data.id);
    constants.set_global("GAME_STATE",data.gameState);
    if (data.gameState == 1) { //do nothing if lobby state
      for (let player in data.playerData) {
        if (player == data.id) continue;
        Others.addPlayer(player, data.playerData[player], data.metaData[player]);
      }
    }
    Player.setSpectate(true);
  });

  setHandler(constants.MESSAGES.gameStart, (socket, data) => {
    constants.set_global("GAME_STATE",1);
    for (let player in data.playerData) {
      if (player == constants.get_global("CLIENT_ID")) {
        Player.updatePlayer(data.playerData[constants.get_global("CLIENT_ID")]);
        Player.setSpectate(false);
        continue
      }
      Others.addPlayer(player, data.playerData[player], data.metaData[player]);
    }

    constants.set_global("GAME_START_TIME",data.startTime);
    constants.set_global("GAME_END_TIME",data.endTime);

  })

  setHandler(constants.MESSAGES.gameEnd, (socket,data) =>{ 
    constants.set_global("GAME_STATE",0);
    constants.set_global("PLAYING",false);
    Player.setSpectate(true);

    Others.clearPlayers();
    Balls.clearBalls();
  })

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
    Player.updatePlayer(data.playerData[constants.get_global("CLIENT_ID")]);
    Others.updatePlayers(data.playerData);
    Balls.updateBalls(data.ballData);
  });

  setHandler(constants.MESSAGES.playerKnockout, (socket,data) => {
    console.log("[HIT]",data);
    if (data.target == constants.get_global("CLIENT_ID")) {
      Player.setSpectate(true) //HANDLE DEATH! DONT DO THIS;
      console.log("I was hit!");
    }
  })

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

export default function main() {
  //establish scene and renderer
  var scene = new three.Scene();
  scene.background = getSkybox();
  var renderer = new three.WebGLRenderer({ antialias: true });
  renderer.domElement.id = "GameCanvas";
  document.body.appendChild(renderer.domElement);

  //load models
  loadDefault()
  //add camera
  var camera = Player.createCamera();

  //add world
  scene.add(createWorld());
  

  //add lights
  let light = new three.PointLight(0xffffff, 3, 0, 0);
  scene.add(light);
  scene.add(new three.AmbientLight(0xffffff,4));

  //add other players
  scene.add(Others.getPlayerModelGroup());
  scene.add(Balls.getBallGroup());

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
    } else if (ev.key == "T") {
      Player.setSpectate(false);
    }
  });

  //setup websockets
  constants.add_listener("LOADED",()=>{
    console.log("LOADED ALL MODELS!");
    websocketSetup();
  }, false)

  //Attach player keybinds
  Player.attachKeybinds();

  //Update viewport whenever changed
  updateAspect(renderer, Player.getCamera());
  window.addEventListener("resize", () => {
    updateAspect(renderer, Player.getCamera());
  });

  //Render loop
  function animate() {
    Player.update();
    Others.update();
    Balls.update();
    renderer.render(scene, Player.getCamera());
    requestAnimationFrame(animate);
  }
  animate();
}
