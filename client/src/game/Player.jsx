import * as three from 'three'
import { getSocket } from './Connection'
import * as constants from '../constants'

var camera
var spectateCamera

var spectateAnim = 0

constants.set_global('SPECTATING', true)
var spectating = true

// Properties of the client's player in-game

/**
 * Object containing properties for Player object.
 * @constant
 * @name properties
 * @type {Object}
 */
var properties = {
  x: 0,
  y: constants.ALIVE_Y,
  z: 0,
  directionHeld: [0, 0, 0, 0],
  hasBall: false,
  alive: true,
}

var movementVector = new three.Vector3()
var perpVector = new three.Vector3()
var intermediateVector = new three.Vector3()
var prevCamVector = new three.Vector3()

var dashScalar = 1 // always applied to movements, greater than 1 when dash is used
var dashAvailable = true // based on dash cooldown, defines when dash can be used

/**
 * Object mapping keybinds to numerical values.
 * @constant
 * @name keybinds
 * @type {Object}
 */
let keybinds = {
  w: 0,
  a: 1,
  s: 2,
  d: 3,
}
/**
 * Adds listener for each keybind
 */
constants.add_listener('KEYBINDS', newBinds => {
  keybinds = {}
  keybinds[newBinds.Forward] = 0
  keybinds[newBinds.Left] = 1
  keybinds[newBinds.Backward] = 2
  keybinds[newBinds.Right] = 3
})

// Uses camera direction and movement key presses to determine player's movement direction

/**
 * Function to calculate the player's movement direction based on key inputs and camera orientation.
 * @function
 * @name calculateDirection
 */
function calculateDirection() {
  camera.getWorldDirection(prevCamVector)
  camera.getWorldDirection(movementVector)
  camera.getWorldDirection(perpVector)
  // Forward and Back movement calculation
  movementVector.multiplyScalar(
    properties.directionHeld[0] - properties.directionHeld[2],
  )
  // Side to Side movement calculation
  perpVector.set(
    -perpVector.z * (properties.directionHeld[3] - properties.directionHeld[1]),
    0,
    perpVector.x * (properties.directionHeld[3] - properties.directionHeld[1]),
  )
  movementVector.add(perpVector) // combining horizontal and vertical movements along arena
  movementVector.y = 0 // regardless of camera, player an only move along x and z axes
  movementVector.normalize() // Must normalize movements because all players move at same speed
}

var canSend = true // active when a message can be sent to server to avoid msg flooding, decided by UPDATE_RATE

/**
 * Function to send movement data to the server.
 * @function
 * @name sendMovement
 * @param {boolean} [override=false] - Flag to override movement restrictions for dashing.
 */
function sendMovement(override = false) {
  if (spectating) return // spectating if in lobby or dead, so can't move in that case
  if (canSend || override) {
    // override allows for dashing and unlocking to get past the UPDATE_RATE limit
    getSocket().send(
      JSON.stringify([
        constants.MESSAGES.sendMovement,
        {
          direction: [
            movementVector.x * dashScalar,
            movementVector.z * dashScalar,
          ],
        }, // always applies dashScalar, it is usually just 1
      ]),
    )
    canSend = false
    // UPDATE_RATE decides how often we can send updates to server
    setTimeout(() => {
      canSend = true
    }, constants.UPDATE_RATE)
  }
}

/**
 * Function to throw the ball if conditions allow.
 * @function
 * @name throwBall
 */
function throwBall() {
  if (constants.get_global('LOCKED') && properties.hasBall) {
    // can only throw ball if not in menu and if you are holding ball
    // sends camera direction to server to handle ball velocity
    camera.getWorldDirection(intermediateVector)
    getSocket().send(
      JSON.stringify([
        constants.MESSAGES.throwBall,
        [intermediateVector.x, intermediateVector.y, intermediateVector.z],
      ]),
    )
  }
}
/**
 * Function to handle key down events for player movement and actions.
 * @function
 * @name onKeyDown
 * @param {Event} e - The key down event object (based on keybind).
 */
function onKeyDown(e) {
  if (spectating) return
  // callback is sendMovement(vector) from Connection.jsx
  if (constants.get_global('LOCKED')) {
    let wasMovement = false

    if (e.key in keybinds) {
      // Movement keys: WASD
      let index = keybinds[e.key]
      wasMovement = properties.directionHeld[index] == 0
      properties.directionHeld[index] = 1
    }

    if (e.key == constants.get_global('KEYBINDS').Dash) {
      // dash should only trigger on key press, not release
      if (dashAvailable) {
        wasMovement = true
        dashScalar = constants.DASH_SPEED
        // will fast forward the player in their moving direction

        // starting dash cooldown
        dashAvailable = false
        setTimeout(() => {
          dashAvailable = true
        }, constants.DASH_COOLDOWN)
      }
    }

    // Only calculating and sending movements to server when wasMovement is true.
    // wasMovement is true when the the movement keys are being pressed differently than before.
    // Avoids wasting time recalculating and resending the same movement vector over and over again.
    if (wasMovement) {
      calculateDirection()
      sendMovement(dashScalar == constants.DASH_SPEED)
    }
  }
}

/**
 * Function to handle key up events for player movement and actions.
 * @function
 * @name onKeyUp
 * @param {Event} e - The key up event object.
 */
function onKeyUp(e) {
  if (spectating) return
  // callback is sendMovement(vector) from Connection.jsx
  if (constants.get_global('LOCKED')) {
    let wasMovement = false

    if (e.key in keybinds) {
      // Movement keys: WASD
      let index = keybinds[e.key]
      wasMovement = true
      properties.directionHeld[index] = 0
    } else if (e.key == constants.get_global('KEYBINDS').Throw) {
      throwBall()
    }

    // resets dashScalar after dash is used
    if (dashScalar > 1) {
      wasMovement = true
      dashScalar = 1
    }

    // Only calculating and sending movements to server when wasMovement is true.
    // wasMovement is true when the the movement keys are being pressed differently than before.
    // Avoids wasting time recalculating and resending the same movement vector over and over again.
    if (wasMovement) {
      calculateDirection()
      sendMovement()
    }
  }
}
/**
 * Function to attach key event listeners for player movement and actions.
 * @function
 * @name attachKeybinds
 */
export function attachKeybinds() {
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)

  constants.add_listener('LOCKED', isLocked => {
    if (!isLocked) {
      properties.directionHeld = [0, 0, 0, 0]
      calculateDirection()
      sendMovement(true)
    }
  })
}

// default spectating camera for when player is dead or in lobby

/**
 * Function to create a spectator camera. Default camera when player is dead or in lobby state.
 * @function
 * @name createSpectateCamera
 */
function createSpectateCamera() {
  spectateCamera = new three.PerspectiveCamera(75, 2, 0.1, 1000)
  spectateCamera.position.z = 0
  spectateCamera.position.y = 10
  spectateCamera.position.x = 22
  spectateCamera.zoom = 1
  spectateCamera.lookAt(0, 0, 0)
  spectateCamera.updateProjectionMatrix()
}

// player in-game camera for when game is active and player is alive

/**
 * Function to create a camera for the game. Non-spectating camera for when game is active + player is alive.
 * @function
 * @name createCamera
 * @param {boolean} [spectate=false] - Flag indicating if creating a spectator camera.
 * @returns {PerspectiveCamera} The created camera or spectator camera if specified.
 */
export function createCamera(spectate = false) {
  camera = new three.PerspectiveCamera(75, 2, 0.1, 1000)
  camera.position.z = properties.z
  camera.position.y = properties.y
  camera.position.x = properties.x
  camera.zoom = 1
  camera.lookAt(0, 0, 5)
  camera.updateProjectionMatrix()
  createSpectateCamera()
  if (spectate) {
    return spectateCamera
  }
  return camera
}

/**
 * Function to set the spectating mode.
 * @function
 * @name setSpectate
 * @param {boolean} value - Flag indicating if in spectating mode.
 */
export function setSpectate(value) {
  spectating = (value && true) || false
  constants.set_global('SPECTATING', spectating)
  camera.updateProjectionMatrix()
  spectateCamera.updateProjectionMatrix()
}

/**
 * Function to get the current active camera.
 * @function
 * @name getCamera
 * @param {boolean} [force=false] - Flag to force returning the camera even in spectating mode.
 * @returns {PerspectiveCamera} The active camera.
 */
export function getCamera(force = false) {
  if (spectating && !force) return spectateCamera
  return camera
}

/**
 * Function to get the spectator camera.
 * @function
 * @name getSpectateCamera
 * @returns {PerspectiveCamera} The spectator camera.
 */
export function getSpectateCamera() {
  return spectateCamera
}

/**
 * Function to update player data and handle specific actions based on the update.
 * @function
 * @name updatePlayer
 * @param {Object} data - The updated player data.
 * @param {boolean} [force=false] - Flag to force specified updates.
 */
export function updatePlayer(data, force = false) {
  if (
    data &&
    data.alive &&
    properties.hasBall == false &&
    data.hasBall &&
    !force
  ) {
    constants.set_global('ANNOUNCE', 'You picked up a weapon!')
  }
  properties = {
    ...properties,
    ...data,
  }
  if (force) {
    camera.position.set(properties.x, properties.y, properties.z)
  }
}

/**
 * Function to check if the player is alive.
 * @function
 * @name isAlive
 * @returns {boolean} Indicates if the player is alive.
 */
export function isAlive() {
  return properties.alive
}

const twoPI = Math.PI * 2

/**
 * Function to update the spectator camera position for animation.
 * @function
 * @name updateSpectateCamera
 */
function updateSpectateCamera() {
  spectateAnim += 0.0025118 //pi/180, comes out to full rotation every 6s
  if (spectateAnim > twoPI) {
    spectateAnim = 0
  }
  spectateCamera.position.x = Math.cos(spectateAnim) * 22
  spectateCamera.position.z = Math.sin(spectateAnim) * 22
  spectateCamera.lookAt(0, 0, 0)
}

/**
 * Function to update the game state and handle player movement.
 * @function
 * @name update
 */
export function update() {
  if (spectating) {
    updateSpectateCamera()
    return
  }
  //if dotproduct between camera and previous camera vector < 0.9
  if (movementVector.length() > 0.5) {
    camera.getWorldDirection(intermediateVector)
    let dot = prevCamVector.dot(intermediateVector)
    if (dot < 0.95 && dot > 0.05) {
      //send update to server
      calculateDirection()
      sendMovement()
    }
  }

  intermediateVector.set(properties.x, properties.y, properties.z)
  camera.position.lerp(intermediateVector, 0.2)
}
