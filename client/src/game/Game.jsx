import * as three from 'three'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import { createWorld, getSkybox } from './World'
import { setupConnection, setHandler, getSocket } from './Connection'
import * as constants from '../constants'
import * as Others from './OtherPlayers'
import * as Player from './Player'
import * as Balls from './Balls'
import * as PlayerPet from './PlayerPet'
import { loadDefault } from './Models'
import { handleTokenLogin } from './Authentication'

/**
 * Defines how the game handles messages from server. More detailed explanation embedded below.
 */ 
function websocketSetup() {
  /**
   * Sets up a handler for the 'open' event, which sends a 'playerJoin' message to the server with the player's username when the WebSocket connection is opened.
   *
   * @function
   * @param {WebSocket} socket - The WebSocket instance.
   */
  setHandler('open', socket => {
    var eventMsg = JSON.stringify([
      constants.MESSAGES.playerJoin,
      {
        username: constants.get_global('USERNAME'),
        ready: true,
        ball: constants.get_global('BALL'),
        pet: constants.get_global('PET'),
        icon: constants.get_global('ICON'),
      },
    ])
    socket.send(eventMsg)
  })

  /**
   * Sets up a handler for the 'playerList' message, which all players to scene data based on the received data.
   *
   * @function
   * @param {WebSocket} socket - The WebSocket instance.
   * @param {Object} data - The data object received from the server.
   * @param {string} data.id - The ID of the client player.
   * @param {number} data.gameState - The current state of the game (0 for lobby, 1 for in-game).
   * @param {Object} data.playerData - An object containing the player data, indexed by player IDs.
   * @param {Object} data.metaData - An object containing the metadata for each player, indexed by player IDs.
   * @param {Object} data.ballData - An object containing the ball data.
   * @param {number} data.startTime - The time (in milliseconds) when the game starts.
   * @param {number} data.endTime - The time (in milliseconds) when the game ends.
   * @returns {void}
   */
  setHandler(constants.MESSAGES.playerList, (socket, data) => {
    constants.set_global('CLIENT_ID', data.id)
    constants.set_global('GAME_STATE', data.gameState)
    if (data.gameState == 1) {
      //do nothing if in lobby state
      for (let player in data.playerData) {
        if (player == data.id) continue
        Others.addPlayer(player, data.playerData[player], data.metaData[player]) // adds other players to the scene
      }
      Balls.updateBalls(data.ballData)
      constants.set_global('TIMER_LABEL', 'Game ends in')
      constants.set_global('CURRENT_TIMER', data.endTime)
    } else {
      constants.set_global('TIMER_LABEL', 'Game starts in')
      constants.set_global('CURRENT_TIMER', data.startTime)
    }
  })

  /**
   * Sets up a handler for the 'gameStart' message, which initializes the game state and players based on the received data.
   *
   * @function
   * @param {WebSocket} socket - The WebSocket instance.
   * @param {Object} data - The data object received from the server.
   * @param {Object} data.playerData - An object containing the player data, indexed by player IDs.
   * @param {Object} data.metaData - An object containing the metadata for each player, indexed by player IDs.
   * @param {number} data.startTime - The time (in milliseconds) when the game starts.
   * @param {number} data.endTime - The time (in milliseconds) when the game ends.
   */
  setHandler(constants.MESSAGES.gameStart, (socket, data) => {
    constants.set_global('GAME_STATE', 1)
    constants.set_global('GAME_OVER', false)
    for (let player in data.playerData) {
      if (player == constants.get_global('CLIENT_ID')) {
        // updates client based on server's info about that client (alive status, client's points in-game, position, etc.)
        let playerData = data.playerData[constants.get_global('CLIENT_ID')]
        Player.updatePlayer(playerData, true)
        Player.setSpectate(false)
        Player.getCamera().lookAt(
          playerData.x,
          constants.ALIVE_Y,
          -playerData.z,
        )
        constants.set_global('LOCKED', true)
        constants.set_global('HITS', 0)
        constants.set_global(
          'ANNOUNCE',
          `You joined the ${data.metaData[player].team == 0 ? 'Blue' : 'Red'} team!`,
        )

        if (data.metaData[player].pet) {
          PlayerPet.createPet(
            data.metaData[player].pet,
            playerData,
            data.metaData[player].team,
          )
        }
        continue
      }
      Others.addPlayer(player, data.playerData[player], data.metaData[player])
    }

    constants.set_global('CURRENT_TIMER', data.startTime)
    constants.set_global(
      'START_TIMEOUT',
      setTimeout(() => {
        constants.set_global('TIMER_LABEL', 'Game ends in')
        constants.set_global('CURRENT_TIMER', data.endTime)
      }, data.startTime - Date.now()),
    )
  })

  /**
   * Sets up a handler for the 'gameEnd' message, which handles the end of a game and resets the game state.
   *
   * @function
   * @param {WebSocket} socket - The WebSocket instance.
   * @param {Object} data - The data object received from the server.
   * @param {string} data.mvp - The ID of the player who was the MVP (Most Valuable Player).
   * @param {Object} data.mvpData - The data associated with the MVP.
   * @param {string} data.winner - The ID of the player who won the game.
   * @param {number} data.points - The individual score of the player.
   * @param {number} data.totalPoints - The total points of the player.
   * @param {number} data.startTime - The time (in seconds) until the next game starts.
   */
  setHandler(constants.MESSAGES.gameEnd, (socket, data) => {
    clearTimeout(constants.get_global('START_TIMEOUT'))
    constants.set_global('DEAD', false)
    constants.set_global('MVP', data.mvp)
    constants.set_global('MVP_DATA', data.mvpData)
    constants.set_global('GAME_STATE', 0)
    constants.set_global('WINNER', data.winner)
    constants.set_global('INDIVIDUAL_SCORE', data.points)
    constants.set_global('POINTS', data.totalPoints)
    Player.setSpectate(true)

    Others.clearPlayers()
    Balls.clearBalls()
    PlayerPet.deletePet()

    constants.set_global('TIMER_LABEL', 'Game starts in')
    constants.set_global('CURRENT_TIMER', data.startTime)
    constants.set_global('LOCKED', false)
    constants.set_global('GAME_OVER', true)

    if (localStorage.getItem('token')) {
      handleTokenLogin()
    }

    //QUEUE
    var eventMsg = JSON.stringify([
      constants.MESSAGES.playerJoin,
      {
        username: constants.get_global('USERNAME'),
        ready: constants.get_global('IN_QUEUE'),
        ball: constants.get_global('BALL'),
        pet: constants.get_global('PET'),
        icon: constants.get_global('ICON'),
      },
    ])
    socket.send(eventMsg)
  })

  /**
   * On other player connect, add their data to scene
   */
  setHandler(constants.MESSAGES.playerJoin, (socket, data) => {
    Others.addPlayer(data.id, data.playerData, data.metaData)
  })

  /**
   * On other player disconnect, remove their data from scene
   */
  setHandler(constants.MESSAGES.playerLeave, (socket, data) => {
    Others.removePlayer(data.id)
  })

  /**
   * On server update, update scene of players and balls
   */
  setHandler(constants.MESSAGES.serverUpdate, (socket, data) => {
    Player.updatePlayer(data.playerData[constants.get_global('CLIENT_ID')])
    Others.updatePlayers(data.playerData)
    Balls.updateBalls(data.ballData)
  })

  /**
   * Sets up a handler for the 'playerKnockout' message, which handles player knockouts and updates the game state accordingly.
   *
   * @function
   * @param {WebSocket} socket - The WebSocket instance.
   * @param {Object} data - The data object received from the server.
   * @param {string} data.target - The ID of the player who was knocked out.
   * @param {string} data.killer - The ID of the player who knocked out the target.
   */
  setHandler(constants.MESSAGES.playerKnockout, (socket, data) => {
    console.log('[HIT]', data)

    if (data.target == constants.get_global('CLIENT_ID')) {
      // If player is hit, they won't know yet
      constants.set_global(
        'ANNOUNCE',
        `You were killed by ${Others.getMetadataByPlayerID(data.killer).username}!`,
      )
      constants.set_global('DEAD', true)
    } else {
      if (data.killer == constants.get_global('CLIENT_ID')) {
        constants.set_global(
          'ANNOUNCE',
          `You killed ${Others.getMetadataByPlayerID(data.target).username}!`,
        )
        constants.set_global('HITS', constants.get_global('HITS') + 1)
      }
      Others.playerDeath(data.target, data.killer)
    }
  })

  /**
   * Sets up a handler for the 'pauseClock' message, which updates the game timer based on the received data.
   *
   * @function
   * @param {WebSocket} socket - The WebSocket instance.
   * @param {Object} data - The data object received from the server.
   * @param {boolean} data.pause - A flag indicating whether the timer should be paused or not.
   * @param {number} [data.newTime] - The new time value for the timer, if provided.
   */
  setHandler(constants.MESSAGES.pauseClock, (socket, data) => {
    if (data.pause) {
      constants.set_global('TIMER_LABEL', 'Waiting for players')
      constants.set_global('CURRENT_TIMER', null)
    } else {
      constants.set_global('TIMER_LABEL', 'Game starts in')
      constants.set_global('CURRENT_TIMER', data.newTime)
    }
  })

  /**
   * Adds an event listener for the 'IN_QUEUE' event, which sends a 'playerJoin' message to the server with the player's information.
   *
   * @listens IN_QUEUE
   * @param {boolean} inQueue - A flag indicating whether the player is in the queue or not.
   * @returns {void}
   */
  constants.add_listener('IN_QUEUE', inQueue => {
    var eventMsg = JSON.stringify([
      constants.MESSAGES.playerJoin,
      {
        username: constants.get_global('USERNAME'),
        ready: inQueue,
        ball: constants.get_global('BALL'),
        pet: constants.get_global('PET'),
        icon: constants.get_global('ICON'),
      },
    ])
    getSocket().send(eventMsg)
  })
  setupConnection()
}

/**
 * Updates the aspect ratio of the renderer and camera based on the canvas size.
 *
 * @param {WebGLRenderer} renderer - The Three.js WebGLRenderer instance.
 * @param {Camera} camera - The Three.js Camera instance.
 */
function updateAspect(renderer, camera) {
  const canvas = renderer.domElement
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth
  const height = canvas.clientHeight

  // adjust displayBuffer size to match
  if (canvas.width !== width || canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
}

function initialize() {
  //set globals
  constants.set_global('LOCKED', false)

  //handle login from here
}

/**
 * The main entry point of the application, responsible for setting up the Three.js scene, loading models, adding lights, and initializing the game loop.
 *
 * @function main
 */
export default function main() {
  //establish scene and renderer
  var scene = new three.Scene()
  scene.background = getSkybox()
  var renderer = new three.WebGLRenderer({ antialias: true })
  renderer.domElement.id = 'GameCanvas'
  document.body.appendChild(renderer.domElement)

  //load models
  loadDefault()
  //add camera
  var camera = Player.createCamera()

  //add world
  scene.add(createWorld())

  //add lights
  let light = new three.PointLight(0xffffff, 3, 0, 0)
  scene.add(light)
  scene.add(new three.AmbientLight(0xffffff, 4))

  //add other players
  scene.add(Others.getPlayerModelGroup())
  scene.add(Balls.getBallGroup())

  //add player pet
  scene.add(PlayerPet.petGroup)

  var controls = new PointerLockControls(camera, renderer.domElement)
  controls.connect()
  constants.set_global('LOCKED', false)
  document.addEventListener('pointerlockerror', () => {
    constants.set_global('LOCKED', false)
  })
  //Add camera locking
  constants.add_listener('LOCKED', isLocked => {
    if (isLocked) {
      try {
        controls.lock()
      } catch {
        constants.set_global('LOCKED', false)
      }
    } else {
      controls.unlock()
    }
  })
  controls.addEventListener('unlock', () => {
    constants.set_global('LOCKED', false)
  })

  //setup websockets
  constants.add_listener(
    'LOADED',
    () => {
      console.log('LOADED ALL MODELS!')
      websocketSetup()
    },
    false,
  )

  //Attach player keybinds
  Player.attachKeybinds()

  //Update viewport whenever changed
  updateAspect(renderer, Player.getCamera())
  window.addEventListener('resize', () => {
    //fix both spectate and regular camera
    updateAspect(renderer, Player.getCamera(true))
    updateAspect(renderer, Player.getSpectateCamera())
  })

  /**
   * The main animation render loop function that updates the game state and renders the scene.
   *
   * @function animate
   */
  function animate() {
    Player.update()
    Others.update()
    Balls.update()
    PlayerPet.update(Player.isAlive())
    renderer.render(scene, Player.getCamera())
    requestAnimationFrame(animate)
  }
  animate()
}
