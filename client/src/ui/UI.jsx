import { useEffect, useState, createContext, useContext } from 'react'
import './ui.css'
import crosshair from './crosshair.svg'
// import ErrorModal from "./ErrorModal";
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { TablePagination } from '@mui/material'
import backgroundImage from '../../assets/textures/Background.png'
import Store from '../menus/Store'
import PropTypes from 'prop-types'
import * as constants from '../constants'

// import pkg from "../../../db/database.cjs";
// const { getLeaderboardList } = pkg;

import sampleData from './sample-data.json'

constants.set_global('AUTHENTICATED', false)
// TODO: when page is loaded, check token in cookies against server
// if so, start as logged in, otherwise logged out
var token_to_username = {}

// const SharedBooleanContext = createContext();

// const SharedBooleanProvider = ({ children }) => {
//   const [sharedBoolean, setSharedBoolean] = useState(false);

//   const setSharedBooleanValue = (value) => {
//     setSharedBoolean(value);
//   };

//   const getSharedBooleanValue = () => {
//     return sharedBoolean;
//   };

//   return (
//     <SharedBooleanContext.Provider
//       value={{ sharedBoolean, setSharedBooleanValue, getSharedBooleanValue }}
//     >
//       {children}
//     </SharedBooleanContext.Provider>
//   );
// };

// const setSharedBoolean = (value) => {
//   const { setSharedBooleanValue } = useContext(SharedBooleanContext);
//   setSharedBooleanValue(value);
// };

// // Function to get the shared boolean value
// const getSharedBoolean = () => {
//   const { getSharedBooleanValue } = useContext(SharedBooleanContext);
//   return getSharedBooleanValue();
// };

// const handleOpenModal = () => {
//   console.log(users);
//   console.log("inside handleOpenModal");
//   setOpenModal(true);
// };

// const [sharedBool, setSharedBool] = useState(false);

var tester = true
async function handleSignup(username, pw, conf_pw) {
  // check if pw is same as conf_pw
  if (pw !== conf_pw) {
    alert('Passwords do not match. Please try again with matching passwords.')
  }

  // console.log(admin);
  // console.log(pw);
  await fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: pw,
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if (data.error) {
        console.log(data.error)
        alert(data.error)
      }
      console.log('signup data:', data)
      localStorage.setItem('token', data.token)
      token_to_username[data.token] = username

      constants.set_global('AUTHENTICATED', true)
    })
}

async function handleLogin(username, pw) {
  console.log(username)
  console.log(pw)

  await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: pw,
    }),
  })
    .then(response => response.json())
    .then(data => {
      const jsondata = JSON.parse(data)
      console.log(jsondata)
      if (jsondata.error) {
        console.log(jsondata.error)
        alert(jsondata.error)
      }
      // setSharedBool(true);
      console.log('login token:', jsondata.token)
      localStorage.setItem('token', jsondata.token)
      constants.set_global('AUTHENTICATED', true)

      token_to_username[data.token] = username
      for (var key in token_to_username) {
        console.log(key + ' : ' + token_to_username[key])
      }

      constants.set_global('WEAPON', jsondata.ball)
      constants.set_global('PET', jsondata.pet)
      constants.set_global('POINTS', jsondata.points)
      constants.set_global('USERNAME', jsondata.username)
      constants.set_global('ICON', jsondata.icon)
      constants.set_global('OWNED', jsondata.item_array)
    })
}

function Leaderboard() {
  const [users, setUsers] = useState([])
  const [openModal, setOpenModal] = useState(false)

  const [page, setPage] = useState(0)
  const rowsPerPage = 10

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const testUsers = sampleData.users

  useEffect(() => {
    console.log('official users')

    fetch('/get_leaderboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('leaderboard data:', data)
        console.log('type of data:', typeof data)

        setUsers(JSON.parse(data))
        console.log('leaderboard data:', users)
        console.log('type of data:', typeof users)
      })
  }, [])

  // useEffect(() => {
  //   axios
  //     .get("https://your-api-url.com/users")
  //     .then((response) => {
  //       setUsers(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

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
        style={{ margin: '25px' }}
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
            width: '400px',
          }}
        >
          <h1 style={{ color: 'black' }}>Leaderboard</h1>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                color: 'black',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#333', color: 'white' }}>
                  <th style={{}}>Rank</th>
                  <th style={{}}>Username</th>
                  <th style={{}}>Points</th>
                  <th style={{}}>Hits</th>
                </tr>
              </thead>
              <tbody>
                {users
                  // .slice(indexOfFirstUser, indexOfLastUser)
                  .map((user, index) => (
                    <tr key={user.username}>
                      <td>{indexOfFirstUser + index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.wins}</td>
                      <td>{user.losses}</td>
                      <td>{user.hits}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <TablePagination
              component="div"
              count={users.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
            />
          </div>

          <Button variant="contained" onClick={handleCloseModal}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  )
}

function ToggleLoginScreen() {
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [auth, setAuth] = useState(false)

  // if(constants.get_global('AUTHENTICATED')){

  // }

  // const { sharedBoolean } = getSharedBoolean();
  function handleToggleLogin() {
    setShowLogin(!showLogin)
  }

  // useEffect(() => {
  //   let listener = constants.add_listener('AUTHENTICATED', setAuth)
  //   // return constants.remove_listener('AUTHENTICATED', listener)
  // }, [])

  return (
    <Box position="relative">
      {/* {auth && <Button>aaaa</Button>} */}
      <Button id="logIn" variant="outlined" onClick={handleToggleLogin}>
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
              },
              label: { color: 'white' },
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
              label: { color: 'white' },
            }}
            style={{ padding: 10 }}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <br />
          <Button
            onClick={() => handleLogin(email, password)}
            style={{ color: 'white', paddingLeft: 10 }}
          >
            Submit
          </Button>
        </Box>
      )}
    </Box>
  )
}

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
      <Button id="signUp" variant="outlined" onClick={handleToggleSignUp}>
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
              },
              label: { color: 'white' },
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
              label: { color: 'white' },
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
              label: { color: 'white' },
            }}
          />
          <br />
          <Button
            onClick={() => handleSignup(email, password, confirmPassword)}
            style={{ color: 'white', paddingLeft: 10 }}
          >
            Submit
          </Button>
        </Box>
      )}
    </Box>
  )
}

// export default function UI({}) {
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [username, setUsername] = useState("Hello World");
//   const [loginClicked, setLoginClicked] = useState(false);
//   const [loggedIn, setLoggedIn] = useState(false);

//   if (localStorage.getItem("token") in token_to_username) {
//     // TODO: toggle to logged in screen with user token_to_username[localStorage.getItem("token")]
//   } else {
//     // TODO: toggle to logged out screen
//   }

const renderShopButton = () => {
  const handleShopClick = () => {
    // Add your logic for handling the 'Shop' button click here
    console.log('Shop button clicked')
  }

  return <button onClick={handleShopClick}>Shop</button>
}

export default function UI({ showAlert }) {
  const [showOverlay, setShowOverlay] = useState(false)
  const [username, setUsername] = useState('Hello World')
  const [loginClicked, setLoginClicked] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  const [auth, setAuth] = useState(false)

  // props validation
  UI.propTypes = {
    showAlert: PropTypes.func.isRequired,
  }

  if (localStorage.getItem('token') in token_to_username) {
    // TODO: toggle to logged in screen with user token_to_username[localStorage.getItem("token")]
  } else {
    // TODO: toggle to logged out screen
  }
  useEffect(() => {
    let listener = constants.add_listener('AUTHENTICATED', setAuth)
    // return constants.remove_listener('AUTHENTICATED', listener)
  }, [])
  // START: Giang's stuff
  function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  const [showStore, setShowStore] = useState(true)

  // array of item objects
  const [allItems, setAllItems] = useState(deepCopy(constants.BUYABLE_MODELS))
  const [equippedItems, setEquippedItems] = useState([null, null, null]) // 0 is weapon, 1 is armor, 2 is accessory
  const [ownedItems, setOwnedItems] = useState([])
  const [coins, setCoins] = useState(1000) // default 1000 coins

  // TIE HERE
  useEffect(() => {
    setAllItems(deepCopy(constants.BUYABLE_MODELS))
    setOwnedItems([])
    setEquippedItems([null, null, null])
    setCoins(1000)
  }, [])

  // update the backend with the new owned items
  useEffect(() => {}, [ownedItems, equippedItems, coins])

  const handleBuy = item => {
    console.log(`Buying ${item.name} with id ${item.id}`)
    const newlyOwnedItems = deepCopy(ownedItems)

    // check if any item with the same id is already owned
    if (newlyOwnedItems.find(ownedItem => ownedItem.id === item.id)) {
      console.log('Item already owned')
      return
    }
    newlyOwnedItems.push(item)
    setOwnedItems(newlyOwnedItems)
    constants.set_global('OWNED', ownedItems)
  }

  const handleClose = () => {
    setShowStore(false)
  }

  const handleEquip = (weapon, armor, accessory) => {
    setEquippedItems(deepCopy([weapon, armor, accessory]))
    constants.set_global('WEAPON', equippedItems[0])
    constants.set_global('PET', equippedItems[2])
  }
  // END Giang's stuff
  useEffect(() => {
    document.addEventListener('lock', () => {
      setShowOverlay(true)
    })
    document.addEventListener('unlock', () => {
      setShowOverlay(false)
    })
    document.addEventListener('setUsername', e => {
      setUsername(e.detail)
    })
  }, [])

  //Ishaan conditional
  // useEffect(() => {
  //   let listener = constants.add_listener('AUTHENTICATED', setAuth)
  //   // return constants.remove_listener('AUTHENTICATED', listener)
  // }, [])

  return (
    <>
      {/* START: Giang's stuff */}
      <Store
        isOpen={showStore}
        availableItems={allItems}
        ownedItems={ownedItems}
        onClose={handleClose}
        onBuy={handleBuy}
        equippedItems={equippedItems}
        handleEquip={handleEquip}
        showAlert={showAlert}
        coins={coins}
        setCoins={setCoins}
      />
      {/* END: Giang's stuff */}
      <div id="UI" style={{ display: (showOverlay && 'none') || 'block' }}>
        <h1 id="logo">Balhalla</h1>
        <h2>{username}</h2>

        <Button
          variant="contained"
          id="logIn"
          onClick={() => {
            document.dispatchEvent(new CustomEvent('lock'))
          }}
        >
          Return to Game
        </Button>
        {!auth && <ToggleLoginScreen></ToggleLoginScreen>}

        {!auth && <ToggleSignUpScreen id="logIn"></ToggleSignUpScreen>}

        <Leaderboard></Leaderboard>
        <Button id="logIn" variant="outlined">
          Shop
        </Button>
        {/* {sharedBool && <title>Shared Works</title>} */}
      </div>
      <div
        id="crosshair"
        style={{ display: (showOverlay && 'block') || 'none' }}
      >
        <img src={crosshair} width={50} height={50} />
      </div>
    </>
  )
}
