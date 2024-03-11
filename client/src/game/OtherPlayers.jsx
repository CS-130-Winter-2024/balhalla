import * as three from "three";
import { Text } from "troika-three-text";
import { getCamera } from "./Player";
import { getModelInstance } from "./Models";
import { get_global } from "../constants";

// Makes entire player model, including nametag above body
class PlayerModel {
  constructor(metadata) {
    this.body = new three.Group();
    this.body.add(getModelInstance(metadata["body"]));
    this.group = new three.Group();
    this.tag = new Text();
    this.tag.text = metadata.username + (metadata.team == 0 && " [BLUE]" || " [RED]");
    this.tag.fontSize = 0.5;
    this.tag.anchorX = "center";
    this.tag.anchory = "center";
    this.tag.position.y = 2.5;
    this.tag.outlineWidth = "10%";
    this.body.rotateY(1.5);

    this.group.add(this.tag);
    this.group.add(this.body);
  }

  dispose() {
    console.log(this.tag,"Tag");
    this.tag.dispose();
    this.body.remove(this.body.children[0]);
    this.group.remove(this.tag);
    this.group.remove(this.body);
  }

  update(camera) {
    this.tag.quaternion.copy(camera.quaternion);
  }
}


var players = {};
var playersMetadata = {};
var playersModels = {};

var otherPlayerGroup = new three.Group();

var reusableVector = new three.Vector3(0, 0, 0);

//Add player to scene and player list
export function addPlayer(playerID, data, metadata) {
  //Add player to gamedata
  players[playerID] = data;
  //Add player metadata
  playersMetadata[playerID] = metadata;

  //add 3d model to model group
  playersModels[playerID] = new PlayerModel(metadata);
  otherPlayerGroup.add(playersModels[playerID].group);
}

export function removePlayer(playerID) {
  playersModels[playerID].dispose();
  otherPlayerGroup.remove(playersModels[playerID].group);
  delete playersModels[playerID];
  delete players[playerID];
  delete playersMetadata[playerID];
}

export function clearPlayers() {
  for (const playerID in players) {
    if (playerID == get_global("CLIENT_ID")) continue;
    console.log("Removing",playerID,"from",players);
    removePlayer(playerID);
  }
}

// Called on server update message
export function updatePlayers(update) {
  players = {
    ...players,
    ...update,
  };
}

//update the 3d models of the players using the "players" object
//called every frame
export function update() {
  for (let playerID in players) {
    if (playerID == get_global("CLIENT_ID")) continue;
    if (!(playerID in playersModels)) continue;
    playersModels[playerID].update(getCamera());
    reusableVector.set(players[playerID].x, 0.5, players[playerID].z); // reusableVector holds actual position in server
    playersModels[playerID].group.position.lerp(reusableVector, 0.1); // gives smoother transition from current position to target position
    
    // Used to orient the player models in the direction they last moved toward
    let rotation = Math.atan2(players[playerID].direction[0], players[playerID].direction[1]);
    if(players[playerID].direction[0] != 0 || players[playerID].direction[1] != 0){
      playersModels[playerID].body.rotation.y = rotation  + Math.PI;
    }
  }
}

//ThreeJS function for displaying all the players
export function getPlayerModelGroup() {
  return otherPlayerGroup;
}
