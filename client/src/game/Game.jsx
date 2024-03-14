import * as three from 'three'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import { createWorld, getSkybox } from './World'
import { setupConnection, setHandler, getSocket } from './Connection'
import * as constants from '../constants'
import * as Others from './OtherPlayers'
import * as Player from './Player'
import * as Balls from './Balls'
import { loadDefault } from './Models'

// Defines how the game handles messages from server
function websocketSetup() {
  //On connect, send username
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
    document.dispatchEvent(new CustomEvent('setUsername', { detail: usernm }))
  })

  //On player list sent, add all players to scene
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
        constants.set_global(
          'ANNOUNCE',
          `You joined the ${data.metaData[player].team == 0 ? 'Blue' : 'Red'} team!`,
        )
        continue
      }
      Others.addPlayer(player, data.playerData[player], data.metaData[player])
    }

    constants.set_global('CURRENT_TIMER', data.startTime)
    setTimeout(() => {
      constants.set_global('TIMER_LABEL', 'Game ends in')
      constants.set_global('CURRENT_TIMER', data.endTime)
    }, data.startTime - Date.now())
  })

  setHandler(constants.MESSAGES.gameEnd, (socket, data) => {
    constants.set_global('GAME_STATE', 0)
    constants.set_global('WINNER', data.winner)
    constants.set_global('MVP', data.mvp)
    constants.set_global('INDIVIDUAL_SCORE', data.points)
    Player.setSpectate(true)

    Others.clearPlayers()
    Balls.clearBalls()

    constants.set_global('TIMER_LABEL', 'Game starts in')
    constants.set_global('CURRENT_TIMER', data.startTime)
    constants.set_global('LOCKED', false)
    constants.set_global('GAME_OVER', true)

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

  //On other player connect, add their data to scene
  setHandler(constants.MESSAGES.playerJoin, (socket, data) => {
    Others.addPlayer(data.id, data.playerData, data.metaData)
  })

  //On other player disconnect, remove their data from scene
  setHandler(constants.MESSAGES.playerLeave, (socket, data) => {
    Others.removePlayer(data.id)
  })

  //On server update, update scene
  setHandler(constants.MESSAGES.serverUpdate, (socket, data) => {
    Player.updatePlayer(data.playerData[constants.get_global('CLIENT_ID')])
    Others.updatePlayers(data.playerData)
    Balls.updateBalls(data.ballData)
  })

  setHandler(constants.MESSAGES.playerKnockout, (socket, data) => {
    console.log('[HIT]', data)

    if (data.target == constants.get_global('CLIENT_ID')) {
      // If player is hit, they won't know yet
      constants.set_global(
        'ANNOUNCE',
        `You were killed by ${Others.getMetadataByPlayerID(data.killer).username}!`,
      )
    } else {
      if ((data.killer = constants.get_global('CLIENT_ID'))) {
        constants.set_global(
          'ANNOUNCE',
          `You killed ${Others.getMetadataByPlayerID(data.target).username}!`,
        )
      }
      Others.playerDeath(data.target)
    }
  })

  setHandler(constants.MESSAGES.pauseClock, (socket, data) => {
    if (data.pause) {
      constants.set_global('TIMER_LABEL', 'Waiting for players')
      constants.set_global('CURRENT_TIMER', null)
    } else {
      constants.set_global('TIMER_LABEL', 'Game starts in')
      constants.set_global('CURRENT_TIMER', data.newTime)
    }
  })

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

  //Render loop
  function animate() {
    Player.update()
    Others.update()
    Balls.update()
    renderer.render(scene, Player.getCamera())
    requestAnimationFrame(animate)
  }
  animate()
}
