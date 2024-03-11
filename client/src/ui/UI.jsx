import { useEffect, useState } from 'react'
import './ui.css'
import crosshair from './crosshair.svg'
import Button from '@mui/material/Button'
import Store from '../menus/Store'
import PropTypes from 'prop-types'
import { BUYABLE_MODELS } from '../constants'

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
}

function DisplayComponent() {
  return (
    <div>
      <h2>This is the displayed component!</h2>
      <p>Replace this with your desired content.</p>
    </div>
  )
}

// props validation
UI.propTypes = {
  showAlert: PropTypes.func.isRequired,
}

export default function UI({ showAlert }) {
  const [showOverlay, setShowOverlay] = useState(false)
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
        <Button variant="outlined" id="logIn" onClick={handleLogin}>
          Log In
        </Button>
        {loginClicked && <DisplayComponent />}
        <Button variant="outlined" id="logIn" onClick={handleSignup}>
          Sign Up
        </Button>
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
