import { useEffect, useState, createContext, useContext } from 'react'
import './ui.css'
import crosshair from './crosshair.svg'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { TablePagination } from '@mui/material'
import backgroundImage from '../../assets/textures/Background.png'
import Store from './components/Store'
import {
  add_listener,
  get_global,
  print_globals,
  remove_listener,
  set_global,
  TEXTURES,
} from '../constants'
import Clock from './components/Clock'
import EndScreen from './components/EndScreen.jsx'
import InGameMenu from './components/InGameMenu.jsx'

import { Announcer } from './components/Announcer.jsx'
import { handleLogin, handleSignup } from '../game/Authentication.jsx'

set_global('AUTHENTICATED', false)

/**
 *function that returns Leaderboard UI element
 *@return {JSX.Element} Leaderboard UI element
 */
function Leaderboard() {
  const [users, setUsers] = useState([])
  const [openModal, setOpenModal] = useState(false)

  const [page, setPage] = useState(0)
  const rowsPerPage = 10

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  /**
   * A React hook that fetches the leaderboard data and sets up event listeners for 'LOCKED' and 'GAME_OVER' events.
   * The event listeners are cleaned up when the component unmounts. The Response for 'get_leaderboard' contains:
   * {
   *   [
   *     {string} username,
   *     {integer} wins,
   *     {integer} losses,
   *     {integer} hits,
   *   ]
   * }
   *
   * @function useEffect
   * @returns {void}
   */
  useEffect(() => {
    let closeListener = add_listener('LOCKED', x => {
      if (!x) return
      setOpenModal(false)
    })
    let listener = add_listener('GAME_OVER', isOver => {
      if (!isOver) return
      fetch('/get_leaderboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          setUsers(JSON.parse(data))
        })
    })

    fetch('/get_leaderboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setUsers(JSON.parse(data))
      })
    
    return () => {
      remove_listener('GAME_OVER', listener)
      remove_listener('LOCKED', closeListener)
    }
  }, [])

  const handleOpenModal = () => {
    console.log(users)
    console.log('inside handleOpenModal')
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    console.log('inside handleClose')
  }

  const indexOfFirstUser = page * rowsPerPage
  const indexOfLastUser = Math.min((page + 1) * rowsPerPage, users.length)

  // const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpenModal}
        style={{
          margin: '25px',
          color: 'black',
          backgroundColor: 'white',
          fontFamily: 'Jorvik',
        }}
        id="logIn"
      >
        Leaderboard
      </Button>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            height: '550px',
            width: '600px',
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Jorvik',
            backgroundImage: TEXTURES.stone,
            alignContent: 'center',
            alignSelf: 'center',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <h1
            style={{
              color: 'white',
              fontFamily: 'Jorvik',
              alignContent: 'center',
              marginTop: '10px',
              flex: 1,
            }}
          >
            Leaderboard
          </h1>
          <div style={{ overflowX: 'auto', flex: 4 }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                color: 'black',
              }}
            >
              <thead>
                <tr style={{ color: 'white' }}>
                  <th style={{ fontFamily: 'Jorvik' }}>Rank</th>
                  <th style={{ fontFamily: 'Jorvik' }}>Username</th>
                  <th style={{ fontFamily: 'Jorvik' }}>Wins</th>
                  <th style={{ fontFamily: 'Jorvik' }}>Losses</th>
                  <th style={{ fontFamily: 'Jorvik' }}>Hits</th>
                </tr>
              </thead>
              <tbody style={{ alignItems: 'center', overflowY: 'scroll' }}>
                {users
                  // .slice(indexOfFirstUser, indexOfLastUser)
                  .map((user, index) => (
                    <tr key={user.username}>
                      <td
                        style={{
                          fontFamily: 'Jorvik',
                          color: 'white',
                          textAlign: 'center',
                        }}
                      >
                        {indexOfFirstUser + index + 1}
                      </td>
                      <td
                        style={{
                          fontFamily: 'Jorvik',
                          color: 'white',
                          textAlign: 'center',
                        }}
                      >
                        {user.username}
                      </td>
                      <td
                        style={{
                          fontFamily: 'Jorvik',
                          color: 'white',
                          textAlign: 'center',
                        }}
                      >
                        {user.wins}
                      </td>
                      <td
                        style={{
                          fontFamily: 'Jorvik',
                          color: 'white',
                          textAlign: 'center',
                        }}
                      >
                        {user.losses}
                      </td>
                      <td
                        style={{
                          fontFamily: 'Jorvik',
                          color: 'white',
                          textAlign: 'center',
                        }}
                      >
                        {user.hits}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {/* <TablePagination
              component="div"
              count={users.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              style={{
                color: 'white',
                position: 'absolute',
                bottom: '20px',
                fontFamily: 'Jorvik',
                left: '100px',
                bottom: '10px',
              }}
              sx={{
                fontFamily: 'Jorvik',
              }}
            /> */}
          </div>
          <div style={{ flex: 1 }}>
            <Button
              variant="contained"
              onClick={handleCloseModal}
              style={{
                color: 'black',
                backgroundColor: 'white',
                fontFamily: 'Jorvik',
                position: 'absolute',
                bottom: '20px',
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

/**
 *returns UI element displayed when user disconnects
 *@retur {JSX.Element} Disconnected
 */
function Disconnected({}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    add_listener('DISCONNECTED', setShow)
  })
  return (
    show && (
      <div
        style={{
          zIndex: 99,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '100% 100%',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <p
          style={{
            fontSize: 32,
            textAlign: 'center',
            position: 'absolute',
            top: '40%',
            width: '100%',
            fontFamily: 'Jorvik',
            color: 'white',
          }}
        >
          You have been disconnected from the server. Please refresh.
        </p>
      </div>
    )
  )
}

/**
 *returns greyed out screen when user gets hit + becomes ghost
 *@returns {JSX.Element} Ghost
 */
function DeadOverlay({}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    add_listener('DEAD', setShow)
  })
  return (
    show && (
      <div
        style={{
          zIndex: 99,
          backgroundColor: '#44c1f2',
          opacity: 0.2,
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <p
          style={{
            fontSize: 32,
            textAlign: 'center',
            position: 'absolute',
            bottom: '30%',
            width: '100%',
            fontFamily: 'Jorvik',
            color: 'black',
            textShadow: '0 0 2px white',
          }}
        >
          You are dead!
        </p>
      </div>
    )
  )
}

/**
 *controls Login button + login fields functionality
 *@return {JSX.Element} Login
 */
function ToggleLoginScreen() {
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // const { sharedBoolean } = getSharedBoolean();
  function handleToggleLogin() {
    setShowLogin(!showLogin)
  }

  // useEffect(() => {
  //   let listener = add_listener('AUTHENTICATED', setAuth)
  //   // return remove_listener('AUTHENTICATED', listener)
  // }, [])

  return (
    <Box position="relative">
      {/* {auth && <Button>aaaa</Button>} */}
      <Button
        id="logIn"
        variant="outlined"
        style={{
          fontFamily: 'Jorvik',
          backgroundColor: 'white',
          color: 'black',
        }}
        onClick={handleToggleLogin}
      >
        {showLogin ? 'Hide Login' : 'Login'}
      </Button>
      {showLogin && (
        <Box
          position="absolute"
          top={-150}
          height={250}
          width={250}
          left="calc(100% + 50px)"
          padding="10px"
          border="10px solid #0"
          borderRadius="10px"
          bgcolor="#0"
          alignItems="center"
          gap={4}
          p={2}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <h2
            id="box"
            style={{
              color: 'white',
              paddingLeft: 10,
              paddingTop: -5,
              margin: '5px',
              fontFamily: 'Jorvik',
            }}
          >
            Login
          </h2>
          <TextField
            id="field"
            style={{ padding: 10, color: 'white' }}
            label="Username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            sx={{
              input: {
                color: 'white',
                backgroundColor: '#65727d',
                borderRadius: '5px',
                fontFamily: 'Jorvik',
              },
              label: { color: 'white', fontFamily: 'Jorvik' },
            }}
          />
          <br />
          <TextField
            id="field"
            label="Password"
            type="password"
            sx={{
              input: {
                color: 'white',
                backgroundColor: '#65727d',
                borderRadius: '5px',
              },
              label: { color: 'white', fontFamily: 'Jorvik' },
            }}
            style={{ padding: 10 }}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <br />
          <Button
            onClick={() => handleLogin(email, password)}
            style={{
              color: 'black',
              backgroundColor: 'white',
              paddingLeft: 10,
              fontFamily: 'Jorvik',
            }}
          >
            Submit
          </Button>
        </Box>
      )}
    </Box>
  )
}
/**
 *controls Sign Up button + sign up fields functionality
 *@returns {JSX.Element} SignUp
 */
function ToggleSignUpScreen() {
  const [showSignUp, setShowSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleToggleSignUp() {
    setShowSignUp(!showSignUp)
  }

  return (
    <Box position="relative">
      <Button
        id="signUp"
        variant="outlined"
        style={{
          fontFamily: 'Jorvik',
          backgroundColor: 'white',
          color: 'black',
        }}
        onClick={handleToggleSignUp}
      >
        {showSignUp ? 'Hide Sign Up' : 'Sign Up'}
      </Button>
      {showSignUp && (
        <Box
          position="absolute"
          marginTop="20px"
          height={350}
          width={250}
          left="calc(100% + 50px)"
          padding="10px"
          border="10px solid #0"
          borderRadius="10px"
          bgcolor="#0"
          alignItems="center"
          gap={2}
          p={2}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <h2
            id="box"
            style={{
              color: 'white',
              paddingLeft: 10,
              paddingTop: -5,
              margin: '5px',
              fontFamily: 'Jorvik',
            }}
          >
            Sign Up
          </h2>
          <TextField
            id="emailField"
            style={{ padding: 10 }}
            label="Username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            sx={{
              input: {
                color: 'white',
                backgroundColor: '#65727d',
                borderRadius: '5px',
                fontFamily: 'Jorvik',
              },
              label: { color: 'white', fontFamily: 'Jorvik' },
            }}
          />
          <br />
          <TextField
            id="passwordField"
            label="Password"
            type="password"
            style={{ padding: 10 }}
            value={password}
            onChange={e => setPassword(e.target.value)}
            sx={{
              input: {
                color: 'white',
                backgroundColor: '#65727d',
                borderRadius: '5px',
              },
              label: { color: 'white', fontFamily: 'Jorvik' },
            }}
          />
          <br />
          <TextField
            id="confirmPasswordField"
            label="Confirm Password"
            type="password"
            style={{ padding: 10 }}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            sx={{
              input: {
                color: 'white',
                backgroundColor: '#65727d',
                borderRadius: '5px',
              },
              label: { color: 'white', fontFamily: 'Jorvik' },
            }}
          />
          <br />
          <Button
            onClick={() => handleSignup(email, password, confirmPassword)}
            style={{
              color: 'black',
              backgroundColor: 'white',
              fontFamily: 'Jorvik',
              paddingLeft: 10,
            }}
          >
            Submit
          </Button>
        </Box>
      )}
    </Box>
  )
}

/**
 *export function for all UI in the left side menu,
 * Includes Leaderboard, Login, Sign Up, and Disconnected
 * @retu {JSX.Element} UI (left menu)
 */
export default function UI({ showAlert }) {
  const [locked, setLocked] = useState(false)
  const [inQueue, setInQueue] = useState(true)
  const [spectating, setSpectating] = useState(true)
  const [username, setUsername] = useState(get_global('USERNAME') || '')

  const [auth, setAuth] = useState(false)

  useEffect(() => {
    // attempt to login with current token
  }, [])
  const [showStore, setShowStore] = useState(false)

  useEffect(() => {
    set_global('IN_QUEUE', true)

    let listener = add_listener('LOCKED', setLocked)
    let spectatingListener = add_listener('SPECTATING', setSpectating)
    let authListener = add_listener('AUTHENTICATED', setAuth)
    let usernameListener = add_listener('USERNAME', setUsername)
    return () => {
      remove_listener('LOCKED', listener)
      remove_listener('AUTHENTICATED', authListener)
      remove_listener('USERNAME', usernameListener)
      remove_listener('SPECTATING', spectatingListener)
    }
  }, [])

  return (
    <>
      <DeadOverlay />
      <Disconnected />
      <EndScreen />
      <Clock />
      <div
        id="UI"
        style={{
          display: (locked && 'none') || (spectating && 'block') || 'none',
          backgroundImage: `url(${TEXTURES.stoneVert})`,
          backgroundSize: '100% 100%',
          border: '2px solid #0',
        }}
      >
        <Store
          isOpen={showStore}
          onClose={() => {
            setShowStore(false)
          }}
          showAlert={showAlert}
        />
        <h1
          id="logo"
          style={{ color: 'white', textAlign: 'center', fontFamily: 'Jorvik' }}
        >
          Balhalla
        </h1>
        <h2
          style={{ textAlign: 'center', fontFamily: 'Jorvik', color: 'white' }}
        >
          {username}
        </h2>

        <Button
          variant="contained"
          id="logIn"
          style={{
            backgroundColor: 'white',
            color: 'black',
            fontFamily: 'Jorvik',
          }}
          onClick={() => {
            print_globals()
            set_global('IN_QUEUE', !inQueue)
            setInQueue(!inQueue)
          }}
        >
          {(inQueue && 'Leave Queue') || 'Enter Queue'}
        </Button>
        {!auth && <ToggleLoginScreen></ToggleLoginScreen>}

        {!auth && <ToggleSignUpScreen id="logIn"></ToggleSignUpScreen>}

        <Leaderboard></Leaderboard>
        {auth && (
          <Button
            id="logIn"
            style={{
              backgroundColor: 'white',
              color: 'black',
              fontFamily: 'Jorvik',
            }}
            onClick={() => {
              setShowStore(true)
            }}
            variant="outlined"
          >
            Shop
          </Button>
        )}
      </div>
      <div id="overlay" style={{ display: (locked && 'block') || 'none' }}>
        <InGameMenu showAlert={showAlert} />
        <Announcer />
        <img
          src={crosshair}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
          }}
          width={50}
          height={50}
        />
      </div>
    </>
  )
}
