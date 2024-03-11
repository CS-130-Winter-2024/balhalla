import { useEffect, useState } from 'react'
import './ui.css'
import crosshair from './crosshair.svg'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Store from '../menus/Store'
import PropTypes from 'prop-types'
import { BUYABLE_MODELS, add_listener, set_global } from '../constants'

// when page is loaded, check token in cookies against server
// if so, start as logged in, otherwise logged out

function handleLogin() {
  setLoginClicked(true) // eslint-disable-line no-undef
}
// CURRENTLY ONLY TESTING SIGNUP/LOGIN
async function handleSignup() {
  let admin = 'test2'
  let pw = '12345'
  console.log(location)
  await fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: admin,
      password: pw,
    }),
  })
    .then(response => {
      console.log('test')
      return response.json()
    })
    .then(data => console.log('signup data:', data))

  await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: admin,
      password: pw,
    }),
  })
    .then(response => response.json())
    .then(data => console.log('login token:', data.token))
  localStorage.setItem('token', data.token)
}

function DisplayComponent() {
  return (
    <div>
      <h2>This is the displayed component!</h2>
      <p>Replace this with your desired content.</p>
    </div>
  )
}

function ToggleLoginScreen() {
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleToggleLogin() {
    setShowLogin(!showLogin)
  }

  // function handleLogin() {
  //   console.log('Email:', email);
  //   console.log('Password:', password);
  // }
  return (
    <Box position="relative">
      <Button id="logIn" variant="outlined" onClick={handleToggleLogin}>
        {showLogin ? 'Hide Login' : 'Login'}
      </Button>
      {showLogin && (
        <Box
          position="absolute"
          top={0}
          height={270}
          width={200}
          left="calc(100% + 50px)"
          padding="10px"
          border="1px solid #ccc"
          bgcolor="#42a5f5"
          alignItems="center"
          gap={4}
          p={2}
        >
          <h2 id="box">Login</h2>
          <TextField
            id="field"
            style={{ padding: 10 }}
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <br />
          <TextField
            id="field"
            label="Password"
            type="password"
            style={{ padding: 10 }}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <br />
          <Button onClick={handleLogin}>Submit</Button>
        </Box>
      )}
    </Box>
  )
  // return (
  //   <div style={{ position: "relative" }}>
  //     <Button id="logIn" onClick={handleToggleLogin}>
  //       {showLogin ? "Hide Login" : "Show Login"}
  //     </Button>
  //     {showLogin && (
  //       <div
  //         style={{
  //           position: "absolute",
  //           top: 0,
  //           left: "calc(100% + 50px)",
  //           padding: "10px",
  //           border: "1px solid #ccc",
  //           backgroundColor: "#f5f5f5",
  //         }}
  //       >
  //         <h2>Login</h2>
  //         <label>Email:</label>
  //         <input
  //           type="email"
  //           value={email}
  //           onChange={(e) => setEmail(e.target.value)}
  //         />
  //         <br />
  //         <label>Password:</label>
  //         <input
  //           type="password"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //         />
  //         <br />
  //         <button onClick={handleLogin}>Submit</button>
  //       </div>
  //     )}
  //   </div>
  // );
}
function ToggleSignUpScreen() {
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleToggleLogin() {
    setShowLogin(!showLogin)
  }

  // function handleLogin() {
  //   console.log('Email:', email);
  //   console.log('Password:', password);
  // }
  return (
    <Box position="relative">
      <Button id="logIn" variant="outlined" onClick={handleToggleLogin}>
        {showLogin ? 'Hide Login' : 'Login'}
      </Button>
      {showLogin && (
        <Box
          position="absolute"
          top={0}
          height={270}
          width={200}
          left="calc(100% + 50px)"
          padding="10px"
          border="1px solid #ccc"
          bgcolor="#42a5f5"
          alignItems="center"
          gap={4}
          p={2}
        >
          <h2 id="box">Login</h2>
          <TextField
            id="field"
            style={{ padding: 10 }}
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <br />
          <TextField
            id="field"
            label="Password"
            type="password"
            style={{ padding: 10 }}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <br />
          <Button onClick={handleLogin}>Submit</Button>
        </Box>
      )}
    </Box>
  )
  // return (
  //   <div style={{ position: "relative" }}>
  //     <Button id="logIn" onClick={handleToggleLogin}>
  //       {showLogin ? "Hide Login" : "Show Login"}
  //     </Button>
  //     {showLogin && (
  //       <div
  //         style={{
  //           position: "absolute",
  //           top: 0,
  //           left: "calc(100% + 50px)",
  //           padding: "10px",
  //           border: "1px solid #ccc",
  //           backgroundColor: "#f5f5f5",
  //         }}
  //       >
  //         <h2>Login</h2>
  //         <label>Email:</label>
  //         <input
  //           type="email"
  //           value={email}
  //           onChange={(e) => setEmail(e.target.value)}
  //         />
  //         <br />
  //         <label>Password:</label>
  //         <input
  //           type="password"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //         />
  //         <br />
  //         <button onClick={handleLogin}>Submit</button>
  //       </div>
  //     )}
  //   </div>
  // );
}

// props validation
UI.propTypes = {
  showAlert: PropTypes.func.isRequired,
}

export default function UI({ showAlert }) {
  const [locked, setLocked] = useState(false)
  const [username, setUsername] = useState('Hello World')
  const [loginClicked, setLoginClicked] = useState(false) // eslint-disable-line

  // START: Giang's stuff
  function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  const [showStore, setShowStore] = useState(true)

  // array of item objects
  const [allItems, setAllItems] = useState(deepCopy(BUYABLE_MODELS))
  const [equippedItems, setEquippedItems] = useState([null, null, null]) // 0 is weapon, 1 is armor, 2 is accessory
  const [ownedItems, setOwnedItems] = useState([])
  const [coins, setCoins] = useState(1000) // default 1000 coins

  // TIE HERE
  useEffect(() => {
    setAllItems(deepCopy(BUYABLE_MODELS))
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
  }

  const handleClose = () => {
    setShowStore(false)
  }

  const handleEquip = (weapon, armor, accessory) => {
    setEquippedItems(deepCopy([weapon, armor, accessory]))
  }
  // END Giang's stuff
  useEffect(() => {
    add_listener("LOCKED",setLocked);
    document.addEventListener('setUsername', e => {
      setUsername(e.detail)
    })
  }, [])

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
      <div id="UI" style={{ display: (locked && 'none') || 'block' }}>
        <h1 id="logo">Balhalla</h1>
        <h2>{username}</h2>

        <Button
          variant="contained"
          id="logIn"
          onClick={() => {
            set_global("LOCKED",true)
          }}
        >
          Return to Game
        </Button>
        <ToggleLoginScreen></ToggleLoginScreen>
        {/* <Button variant="outlined" id="logIn" onClick={handleLogin}>
          Log In
        </Button> */}
        {loginClicked && <DisplayComponent />}
        <Button variant="outlined" id="logIn" onClick={handleSignup}>
          Sign Up
        </Button>
      </div>
      <div
        id="crosshair"
        style={{ display: (locked && 'block') || 'none' }}
      >
        <img src={crosshair} width={50} height={50} />
      </div>
    </>
  )
}
