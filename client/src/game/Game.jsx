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
    constants.set_global("USERNAME",usernm);
    var eventMsg = JSON.stringify([constants.MESSAGES.playerJoin, { username: constants.get_global("USERNAME") }]);
    socket.send(eventMsg);
    document.dispatchEvent(new CustomEvent("setUsername", { detail: usernm }));
    
  });

  //On player list sent, add all players to scene
  setHandler(constants.MESSAGES.playerList, (socket, data) => {
    constants.set_global("CLIENT_ID",data.id);
    constants.set_global("GAME_STATE",data.gameState);
    if (data.gameState == 1) { //do nothing if in lobby state
      for (let player in data.playerData) {
        if (player == data.id) continue;
        Others.addPlayer(player, data.playerData[player], data.metaData[player]); // adds other players to the scene
      }
      constants.set_global("TIMER_LABEL", "Game ends in")
      constants.set_global("CURRENT_TIMER",data.endTime);
    } else{
      constants.set_global("TIMER_LABEL", "Game starts in")
      constants.set_global("CURRENT_TIMER",data.startTime);
    }


  });

  setHandler(constants.MESSAGES.gameStart, (socket, data) => {
    constants.set_global("GAME_STATE", 1);
    Player.setMetadata(data.metaData[constants.get_global("CLIENT_ID")]);
    for (let player in data.playerData) {
      if (player == constants.get_global("CLIENT_ID")) {
        // updates client based on server's info about that client (alive status, client's points in-game, position, etc.)
        let playerData = data.playerData[constants.get_global("CLIENT_ID")];
        Player.updatePlayer(playerData, true);
        Player.setSpectate(false);
        Player.getCamera().lookAt(playerData.x,constants.ALIVE_Y,-playerData.z);
        continue
      }
      Others.addPlayer(player, data.playerData[player], data.metaData[player]);
    }

    constants.set_global("CURRENT_TIMER",data.startTime);
    setTimeout(()=>{
      constants.set_global("TIMER_LABEL", "Game ends in")
      constants.set_global("CURRENT_TIMER",data.endTime)
    },data.startTime-Date.now());
    ;
  })

  setHandler(constants.MESSAGES.gameEnd, (socket,data) =>{ 
    constants.set_global("GAME_STATE",0);
    Player.setSpectate(true);

    Others.clearPlayers();
    Balls.clearBalls();

    constants.set_global("TIMER_LABEL", "Game starts in")
    constants.set_global("CURRENT_TIMER",data.startTime);

    var eventMsg = JSON.stringify([constants.MESSAGES.playerJoin, { username: constants.get_global("USERNAME") }]);
    socket.send(eventMsg);
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
      // If player is hit, they won't know yet
      console.log("I was hit!");
    } else {
      // any hit players should become ghosts
      Others.playerDeath(data.target);
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
  constants.set_global("LOCKED",false);
  document.addEventListener("pointerlockerror",()=>{
    constants.set_global("LOCKED",false);
  })
  //Add camera locking
  constants.add_listener("LOCKED",(isLocked)=>{
    if (isLocked) {
      controls.lock();
    }
  })
  controls.addEventListener("unlock", () => {
    constants.set_global("LOCKED",false);
  });
  // document.addEventListener("keydown", (ev) => {
  //   if (ev.key == " " || ev.key == "Enter") {
  //     // if (locked) {
        
  //     // } else {
        
  //     // }
  //   }
  // });

  // event for when space bar is pressed, it will trigger the ingame menu IF x condition is met
  document.addEventListener("keydown", (ev) => {
    if (ev.key === " ") {
      console.log("space bar pressed")
      document.dispatchEvent(new CustomEvent("spaceBarPressed"));
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
