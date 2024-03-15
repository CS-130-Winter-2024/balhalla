import * as three from 'three'
import { Text } from 'troika-three-text'
import { getCamera } from './Player'
import { getModelInstance } from './Models'
import { get_global } from '../constants'

// Makes entire player model, including nametag above body

/**
 * Class representing a player model in the game. Makes entire player, including nametag above body.
 */
class PlayerModel {
  /**
   * Create a player model.
   * @param {Object} metadata - Metadata for the player.
   */
  constructor(metadata) {
    this.body = new three.Group()
    this.body.add(getModelInstance(0))
    this.group = new three.Group()
    this.tag = new Text()
    this.tag.text = metadata.username
    this.tag.fontSize = 0.5
    this.tag.color = metadata.team == 0 ? '#0000dd' : '#dd0000'
    this.tag.anchorX = 'center'
    this.tag.anchory = 'center'
    this.tag.position.y = 3
    this.tag.outlineWidth = '10%'
    this.tag.outlineColor = '#ffffff'

    this.group.add(this.tag)
    this.group.add(this.body)
    if (metadata.pet) {
      this.pet = getModelInstance(metadata.pet)
      this.pet.position.y = 0
      this.group.add(this.pet)
    }
  }
  /**
   * Dispose of the player model.
   */
  dispose() {
    this.tag.dispose()
    this.body.remove(this.body.children[0])
    this.group.remove(this.tag)
    this.group.remove(this.body)

    if (this.pet) {
      this.pet.remove(this.pet.children[0])
      this.group.remove(this.pet)
    }
  }
  /**
   * Update the player model based on camera and player status.
   * @param {PerspectiveCamera} camera - The camera object.
   * @param {boolean} playerAlive - Flag indicating if the player is alive.
   */
  update(camera, playerAlive) {
    this.tag.position.x = this.body.position.x
    this.tag.position.z = this.body.position.z

    if (this.pet && playerAlive) {
      if (this.pet.position.distanceTo(this.body.position) > 3) {
        this.pet.position.lerp(this.body.position, 0.08)
      }
      this.pet.lookAt(this.body.position)
    }
    this.tag.quaternion.copy(camera.quaternion)
  }
  /**
   * Switch the player viking model to a ghost model.
   */
  switchGhost() {
    // swaps the vikingboat model with the ghost model
    this.body.remove(this.body.children[0])
    this.body.add(getModelInstance('9')) // 9 is the ID for the ghost model
  }
}

var players = {}
var playersMetadata = {}
var playersModels = {}

var otherPlayerGroup = new three.Group()

var reusableVector = new three.Vector3(0, 0, 0)

//Add player to scene and player list

/**
 * Function to add a player to the game. Adds 3d model and pet.
 * @function
 * @name addPlayer
 * @param {string} playerID - The ID of the player.
 * @param {Object} data - Player data to add.
 * @param {Object} metadata - Metadata for the player.
 */
export function addPlayer(playerID, data, metadata) {
  //Add player to gamedata
  players[playerID] = data
  //Add player metadata
  playersMetadata[playerID] = metadata

  console.log('[METADATA]', playersMetadata)

  //add 3d model to model group
  playersModels[playerID] = new PlayerModel(metadata)
  playersModels[playerID].body.position.x = data.x
  playersModels[playerID].body.position.z = data.z
  playersModels[playerID].body.rotateY(metadata.team == 0 ? 0 : Math.PI)
  otherPlayerGroup.add(playersModels[playerID].group)

  if (playersModels[playerID].pet) {
    let pet = playersModels[playerID].pet
    pet.position.x = data.x
    pet.position.z = data.z + (metadata.team == 0 ? -1 : 1)
  }
}

/**
 * Function to remove player from game based on ID
 * @function
 * @name removePlayer
 * @param {string} playerID - The ID of the player being removed.
 */
export function removePlayer(playerID) {
  playersModels[playerID].dispose()
  otherPlayerGroup.remove(playersModels[playerID].group)
  delete playersModels[playerID]
  delete players[playerID]
  delete playersMetadata[playerID]
}

/**
 * Function to clear all players from the game except the local player.
 * @function
 * @name clearPlayers
 */
export function clearPlayers() {
  for (const playerID in players) {
    if (playerID == get_global('CLIENT_ID')) continue
    console.log('Removing', playerID, 'from', players)
    removePlayer(playerID)
  }
}

/**
 * Function to handle player death in the game.
 * @function
 * @name playerDeath
 * @param {string} playerID - The ID of the player who died.
 * @param {string} killerID - The ID of the player who caused the death.
 */
export function playerDeath(playerID, killerID) {
  // function to trigger upon player knockout
  playersModels[playerID].switchGhost()
  if (killerID in playersMetadata) {
    playersMetadata[killerID].hits += 1
  }
}

// Called on server update message
/**
 * Function to update player data, called on server update message.
 * @function
 * @name updatePlayers
 * @param {Object} update - Updated player data from the server.
 */
export function updatePlayers(update) {
  players = {
    ...players,
    ...update,
  }
}

// update the 3d models of the players using the "players" object
// called every frame

/**
 * Function to update player positions and models in the game. Called every frame, uses the players object.
 * @function
 * @name update
 */
export function update() {
  for (let playerID in players) {
    if (playerID == get_global('CLIENT_ID')) continue
    if (!(playerID in playersModels)) continue
    reusableVector.set(players[playerID].x, 0, players[playerID].z) // reusableVector holds actual position in server
    if (
      players[playerID].direction[0] != 0 ||
      players[playerID].direction[1] != 0
    ) {
      playersModels[playerID].body.lookAt(reusableVector)
    }
    playersModels[playerID].body.position.lerp(reusableVector, 0.1) // gives smoother transition from current position to target position
    playersModels[playerID].update(getCamera(), players[playerID].alive)
  }
}

//ThreeJS function for displaying all the players

/**
 * Function to get the group containing all other player models.
 * @function
 * @name getPlayerModelGroup
 * @returns {Group} The group containing other player models.
 */
export function getPlayerModelGroup() {
  return otherPlayerGroup
}

/**
 * Function to retrieve player metadata by player ID.
 * @function
 * @name getMetadataByPlayerID
 * @param {string} playerID - The ID of the player.
 * @returns {Object|null} The metadata of the player, or null if not found.
 */
export function getMetadataByPlayerID(playerID) {
  if (playerID in playersMetadata) return playersMetadata[playerID]
  return null
}
