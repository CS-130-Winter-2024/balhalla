import * as three from "three";
import { Text } from "troika-three-text";
import { getCamera } from "./Player";

const tempMesh = new three.CylinderGeometry(0.5, 0.5, 2);

class PlayerModel {
  constructor(name) {
    this.material = new three.MeshLambertMaterial({ color: 0x888888 });
    this.body = new three.Mesh(tempMesh, this.material);
    this.group = new three.Group();
    this.tag = new Text();
    this.tag.text = name;
    this.tag.fontSize = 0.5;
    this.tag.anchorX = "center";
    this.tag.anchory = "center";
    this.tag.position.y = 2.5;
    this.tag.outlineWidth = "10%";

    this.group.add(this.tag);
    this.group.add(this.body);
  }

  dispose() {
    this.tag.dispose();
    this.material.dispose();
  }

  update(camera) {
    this.tag.quaternion.copy(camera.quaternion);
  }
}

var clientID = -1;
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
  playersModels[playerID] = new PlayerModel(metadata.username);
  otherPlayerGroup.add(playersModels[playerID].group);
}

export function removePlayer(playerID) {
  otherPlayerGroup.remove(playersModels[playerID].group);
  playersModels[playerID].dispose();
  delete playersModels[playerID];
  delete players[playerID];
  delete playersMetadata[playerID];
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
    if (playerID == clientID) continue;
    playersModels[playerID].update(getCamera());
    reusableVector.set(players[playerID].x, 0.5, players[playerID].z); // reusableVector holds actual position in server
    playersModels[playerID].group.position.lerp(reusableVector, 0.1); // gives smoother transition from current position to target position
  }
}

//ThreeJS function for displaying all the players
export function getPlayerModelGroup() {
  return otherPlayerGroup;
}

export function setClientID(id) {
  clientID = id;
}

export function getClientID() {
  return clientID;
}
