// SettingsTabContent.jsx
import { useState, useEffect } from 'react'
import { Button, Box, Typography } from '@mui/material'
import { get_global, set_global } from '../../constants'

/**
 * Array of forbidden keys that should not be used in the keybind menu.
 * @type {string[]}
 */
const forbiddenKeys = [
  ' ',
  'ESCAPE',
  'ENTER',
  'TAB',
  'CAPSLOCK',
  'CONTROL',
  'ALT',
  'META',
]

/**
 * Generates a text styling for component.
 * @param {number} [size=3] - The size of the text (from 0 to 6).
 * @param {boolean} [bolded=false] - Whether the text should be bolded.
 * @param {string} [color='black'] - The color of the text.
 * @returns {Object} - Text style object with specified properties.
 */
function textStyle(size = 3, bolded = false, color = 'black') {
  if (size < 0 || size > 6) {
    console.error('Invalid size for textStyle')
    return
  }
  const fontSizeMapping = [
    '14px',
    '16px',
    '18px',
    '20px',
    '24px',
    '32px',
    '40px',
    '48px',
  ]

  return {
    color: color,
    fontFamily: 'Jorvik',
    textAlign: 'center',
    fontSize: fontSizeMapping[size],
    fontWeight: bolded ? 'bold' : 'normal',
  }
}

let testKeybinds = {
  Forward: 'w',
  Left: 'a',
  Backward: 's',
  Right: 'd',
  Throw: 'f',
  Dash: 'Shift',
}
/**
 * Sets global keybinds with default keybinds WASD, F, Shift.
 */
set_global(
  'KEYBINDS',
  localStorage.getItem('keybinds')
    ? JSON.parse(localStorage.getItem('keybinds'))
    : testKeybinds,
)

/**
 * Functional component for the Settings Tab content.
 * @param {Object} showAlert - Function to display alerts.
 */
function SettingsTabContent({ showAlert }) {
  const [keybinds, setKeybinds] = useState(get_global('KEYBINDS'))
  const [newKeybinds, setNewKeybinds] = useState(get_global('KEYBINDS'))
  const [isSaveVisible, setSaveVisible] = useState(false)

  const handleSave = () => {
    localStorage.setItem('keybinds', JSON.stringify(newKeybinds))
    set_global('KEYBINDS', newKeybinds)
    setKeybinds(newKeybinds)
    setSaveVisible(false)
  }

  const handleUndo = () => {
    setNewKeybinds(keybinds)
  }

  useEffect(() => {
    setSaveVisible(keybinds !== newKeybinds)
  }, [newKeybinds])

  const handleKeybindChange = (index, value) => {
    // checking if the key is already assigned
    for (const keyID in keybinds) {
      if (keyID != index && keybinds[keyID] == value) {
        showAlert(`Key ${value} is already assigned.`, 'error')
        return
      } else if (keyID == index && keybinds[keyID] == value) {
        return
      }
    }

    const updatedKeybinds = { ...newKeybinds }
    updatedKeybinds[index] = value
    setNewKeybinds(updatedKeybinds)
  }

  const handleKeyDown = index => event => {
    const pressedKey = event.key
    if (forbiddenKeys.includes(pressedKey)) {
      showAlert(`You cannot assign ${pressedKey} to a keybind.`, 'error')
      return
    }
    handleKeybindChange(index, pressedKey)
  }

  return (
    <Box style={styles.container}>
      <Typography
        variant="h5"
        gutterBottom
        style={{ ...textStyle(4, true), ...styles.settingHeader }}
      >
        Settings
      </Typography>

      <Box style={styles.keybinds}>
        {Object.keys(newKeybinds).map(keyID => (
          <Box style={styles.keybind} key={keyID}>
            <Typography style={styles.keybindDescription}>{keyID}</Typography>
            <Button
              variant="outlined"
              style={styles.keybindButton}
              onKeyDown={handleKeyDown(keyID)}
              onClick={() => showAlert('Press a key to assign.', 'info')}
            >
              {newKeybinds[keyID]}
            </Button>
          </Box>
        ))}
      </Box>

      <Box style={styles.saveTools}>
        <Button
          variant="contained"
          onClick={handleUndo}
          style={{
            ...styles.saveButton,
            backgroundColor: isSaveVisible && '#880000',
          }}
          disabled={!isSaveVisible}
        >
          Undo
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          style={{
            ...styles.saveButton,
            backgroundColor: isSaveVisible && '#eeeeee',
            color: isSaveVisible && 'black',
          }}
          disabled={!isSaveVisible}
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}

/**
 * Styling for Settings component.
 * @type {Object}
 */
const styles = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    margin: '0px 10px 0 10px',
  },
  settingHeader: {
    borderBottom: '2px solid black',
    marginHorizontal: 'auto',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  keybinds: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    flex: 3,
  },
  keybind: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
    flex: 1,
  },
  keybindButton: {
    fontWeight: 'bold',
    borderRadius: '5px',
    fontFamily: 'Jorvik',
    fontSize: '18px',
    flex: 1,
    padding: 0,
    borderColor: 'black',
    color: 'black',
  },
  keybindDescription: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
    fontFamily: 'Jorvik',
    fontSize: '22px',
  },
  saveTools: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  saveButton: {
    marginTop: '20px',
    zIndex: 1,
  },
}

export default SettingsTabContent
