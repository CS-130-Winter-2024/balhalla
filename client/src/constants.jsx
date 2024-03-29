// here we store universal constants
import viking from '../assets/models/Viking.glb'
import vikingboat from '../assets/models/VikingBoat.glb'
import axe from '../assets/models/weapons/Axe.glb'
import hammer from '../assets/models/weapons/Mjolnir.glb'
import trident from '../assets/models/weapons/Trident.glb'
import tree from '../assets/models/pets/Tree.glb'
import turtle from '../assets/models/pets/Turtle.glb'
import pig from '../assets/models/pets/Pig.glb'
import duck from '../assets/models/pets/Duck.glb'
import vikingghost from '../assets/models/VikingGhost.glb'

import axePng from '../assets/images/axe.png'
import hammerPng from '../assets/images/hammer.png'
import tridentPng from '../assets/images/trident.png'
import treePng from '../assets/images/tree.png'
import turtlePng from '../assets/images/turtle.png'
import pigPng from '../assets/images/pig.png'
import duckPng from '../assets/images/duck.png'

import vikon from '../assets/images/Viking.png'
import kev from '../assets/images/KingKev.jpg'
import panda from '../assets/images/Panda.png'
import shaq from '../assets/images/Shaq.png'
import hamter from '../assets/images/Hamter.jpg'
import goku from '../assets/images/goku_pfp.jpg'

import stone from '../assets/textures/Background.png'
import stoneVert from '../assets/textures/BackgroundVertical.png'
import parchment from '../assets/textures/Parchment.png'

//GAME
export const SPEED = 5 // Player speed
export const ALIVE_Y = 1.4 // Camera position when player is alive

export const DASH_COOLDOWN = 5000
export const DASH_SPEED = 15

export const TAG_HEIGHT = 2.5

//WEBSOCKETS ----------------
export const UPDATE_RATE = 25 // milliseconds between when a player can send updates to the server

/**
 * Messages used for communication between server and client.
 * @type {object}
 * @constant
 */
export const MESSAGES = {
  sendMovement: 'a', //server<-client DONE ON CLIENT
  serverUpdate: 'b', //server->client DONE ON CLIENT
  playerJoin: 'c', //server<->client
  playerLeave: 'd', // server->client
  playerList: 'e', // server->client
  gameStart: 'f', // server->client
  playerKnockout: 'g', //server->client
  gameEnd: 'h', //server->client
  throwBall: 'i', //client->server
  pauseClock: 'j',
}

/**
 * Parses a message from the server and executes the appropriate action.
 * @param {JSON} msg - The message to parse.
 * @returns {dict} data - The data to be sent to the client.
 */
export function message_parse(msg) {
  let output = {}
  let data = JSON.parse(msg)
  output.type = data[0]
  switch (
    data[0] //data[0] = type
  ) {
    case MESSAGES.playerList:
      if (data[1] == 0) {
        output.gameState = data[1]
        output.id = data[2]
        output.startTime = data[3]
      } else {
        output.gameState = data[1]
        output.id = data[2]
        output.playerData = data[3]
        output.metaData = data[4]
        output.startTime = data[5]
        output.endTime = data[6]
        output.ballData = data[7]
        output.ballData.didChange = true
      }
      break
    case MESSAGES.gameStart:
      output.id = data[1]
      output.playerData = data[2]
      output.metaData = data[3]
      output.startTime = data[4]
      output.endTime = data[5]
      break
    case MESSAGES.gameEnd:
      output.winner = data[1]
      output.mvp = data[2]
      output.points = data[3]
      output.startTime = data[4]
      output.totalPoints = data[5]
      output.mvpData = data[6]
      break
    case MESSAGES.serverUpdate:
      output.playerData = data[1]
      output.ballData = data[2]
      break
    case MESSAGES.playerJoin:
      output.id = data[1]
      output.playerData = data[2]
      output.metaData = data[3]
      break
    case MESSAGES.playerLeave:
      output.id = data[1]
      break
    case MESSAGES.playerKnockout:
      output.target = data[1]
      output.killer = data[2]
      break
    case MESSAGES.pauseClock:
      output.pause = data[1]
      output.newTime = data[2]
  }
  return output
}

//THREE.JS
export const DODGE_BALL_SIDES = 28

// uncomment this out when we merge it into the main branch

/**
 * Provides models of each entity in the game.
 * @type {enum}
 * @constant
 */
export const MODEL_IDS = {
  0: viking,
  1: vikingboat,
  // throwable objects (balls)
  2: axe,
  3: hammer,
  4: trident,
  // pet models, to be placed on heads
  5: tree,
  6: turtle,
  7: pig,
  8: duck,
  // model for player when dead
  9: vikingghost,
}
/**
 * Exports properties for each entity.
 * @type {object}
 * @constant
 */
export const MODEL_PROPERTIES = {
  0: {
    name: 'Viking',
    buyable: false,
    type: 'Body',
  },
  1: {
    name: 'Boat',
    buyable: false,
    type: 'Body',
  },
  2: {
    name: 'Axe',
    buyable: true,
    type: 'Weapon',
    cost: 0,
    image: axePng,
  },
  3: {
    name: 'Mjolnir',
    buyable: true,
    type: 'Weapon',
    cost: 200,
    image: hammerPng,
  },
  4: {
    name: 'Trident',
    buyable: true,
    type: 'Weapon',
    cost: 300,
    image: tridentPng,
  },
  5: {
    name: 'Tree',
    buyable: true,
    type: 'Pet',
    cost: 200,
    image: treePng,
  },
  6: {
    name: 'Turtle',
    buyable: true,
    type: 'Pet',
    cost: 300,
    image: turtlePng,
  },
  7: {
    name: 'Pig',
    buyable: true,
    type: 'Pet',
    cost: 300,
    image: pigPng,
  },
  8: {
    name: 'Duck',
    buyable: true,
    type: 'Pet',
    cost: 1000,
    image: duckPng,
  },
  9: {
    name: 'Ghost',
    buyable: false,
    type: 'Body',
  },
}
/**
 * Uses buyable property to export only buyable entities
 * @type {object}
 * @constant
 */
export const BUYABLE_MODELS = Object.keys(MODEL_PROPERTIES).filter(x => {
  return MODEL_PROPERTIES[x].buyable
})

/**
 * Applies animations to a model based on its corresponding model ID
 * @type {object}
 * @constant
 */
export const BALL_ANIMATIONS = {
  // applies animations to a model based on its corresponding model ID
  2: function (model) {
    // axe
    model.rotation.x += 0.1
  },
  3: function (model) {
    // hammer
    model.rotation.x += 0.03
  },
  4: function (model) {
    // trident (will not move, but should face the direction thrown)
    model.rotation.y += 0.5 * Math.PI
    model.rotation.z = 0.5 * Math.PI
  },
}
/**
 * Exports avatar pictures for user profile.
 * @type {object}
 * @constant
 */
export const AVATARS = [vikon, kev, panda, shaq, hamter, goku]

/**
 * Exports only avatar names.
 * @type {object}
 * @constant
 */
export const AVATAR_NAMES = [
  'Viking',
  'King Kev',
  'Panda',
  'Shaquille',
  'Hamter',
  'Goku',
]
/**
 * Exports textures for Three.JS
 * @type {object}
 * @constant
 */
export const TEXTURES = { stone, stoneVert, parchment }

/**
 * Color constants themes
 * @type {object}
 * @constant
 */
export const colors = {
  default: 0xffffff,
  floor: 0x333333,
  red: 0xff0000,
  green: 0x00ff00,
  blue: 0x0000ff,
  yellow: 0xffff00,
  orange: 0xffa500,
}

var GLOBAL_STORE = {}

var LISTENERS = {}

/**
 * Custom function to add listeners to global storage.
 * @param {string} key
 * @param {function} callback
 * @param {boolean} repeat
 * @returns {number} index
 */
export function add_listener(key, fun, repeat = true) {
  let index = 0
  if (key in LISTENERS) {
    let last
    for (const x in LISTENERS[key]) {
      last = x
    }
    index = Number(last) + 1
    LISTENERS[key][index] = [fun, repeat]
  } else {
    LISTENERS[key] = { 0: [fun, repeat] }
  }
  return index
}
/**
 * Removes listeners from global storage.
 * @param {string} key
 * @param {number} index
 */
export function remove_listener(key, index) {
  if (key in LISTENERS && index in LISTENERS[key]) {
    delete LISTENERS[key][index]
  } else {
    console.error(
      'Tried to remove listener',
      index,
      'from key',
      key,
      ', but index does not exist',
    )
  }
}

// used to retrieve values that client needs access to
/**
 * Used to retrieve values that client needs access to.
 * @param {string} key
 * @returns {any} value
 */
export function get_global(key) {
  if (key in GLOBAL_STORE) {
    return GLOBAL_STORE[key]
  }
  return null
}
/**
 * Used to set values that client needs access to.
 * @param {string} key
 * @param {any} value
 */
export function set_global(key, value, trigger = true) {
  GLOBAL_STORE[key] = value
  if (!trigger) return
  if (key in LISTENERS) {
    for (const fun in LISTENERS[key]) {
      try {
        LISTENERS[key][fun][0](value)
        if (!LISTENERS[key][fun][1]) {
          delete LISTENERS[key][fun]
        }
      } catch {
        console.log('[LISTENER] Error listening on ', key, ' for ID', fun)
      }
    }
  }
}
/**
 * Prints global storage to console.
 */
export function print_globals() {
  console.log(GLOBAL_STORE)
}
