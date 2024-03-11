// SettingsTabContent.jsx
import { useState, useEffect } from 'react'
import { Button, Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const forbiddenKeys = [
  ' ',
  'ESCAPE',
  'ENTER',
  'TAB',
  'CAPSLOCK',
  'SHIFT',
  'CONTROL',
  'ALT',
  'META',
  'ARROWUP',
  'ARROWDOWN',
  'ARROWLEFT',
  'ARROWRIGHT',
]

function textStyle(size = 3, bolded = false, color = 'black') {
  if (size < 0 || size > 6) {
    console.error('Invalid size for textStyle')
    return
  }
  const fontSizeMapping = [
    '12px',
    '14px',
    '16px',
    '18px',
    '20px',
    '24px',
    '32px',
    '40px',
  ]

  return {
    color: color,
    fontFamily: 'Roboto, Helvetica, Arial',
    textAlign: 'center',
    fontSize: fontSizeMapping[size],
    fontWeight: bolded ? 'bold' : 'normal',
  }
}

// props validation
SettingsTabContent.propTypes = {
  initialKeybinds: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ),
  showAlert: PropTypes.func.isRequired,
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function SettingsTabContent({
  initialKeybinds = [
    { key: 'W', description: 'Up' },
    { key: 'A', description: 'Left' },
    { key: 'S', description: 'Down' },
    { key: 'D', description: 'Right' },
    { key: 'SPACE', description: 'Throw' },
  ],
  showAlert,
}) {
  const [keybinds, setKeybinds] = useState(deepCopy(initialKeybinds))
  const [newKeybinds, setNewKeybinds] = useState(deepCopy(initialKeybinds))
  const [isSaveVisible, setSaveVisible] = useState(false)

  const handleSave = () => {
    // save keys to local storage
    localStorage.setItem('keybinds', JSON.stringify(newKeybinds))
    setKeybinds(deepCopy(newKeybinds))
    setSaveVisible(false)
  }

  useEffect(() => {
    const isDifferent = JSON.stringify(keybinds) !== JSON.stringify(newKeybinds)
    setSaveVisible(isDifferent)
  }, [keybinds, newKeybinds])

  const handleKeybindChange = (index, value) => {
    // checking if the key is already assigned
    const keyExists = newKeybinds.some(
      (keybind, i) => i !== index && keybind.key === value,
    )
    if (keyExists) {
      showAlert(`Key ${value} is already assigned.`, 'error')
      return
    }
    const updatedKeybinds = [...newKeybinds]
    updatedKeybinds[index].key = value
    setNewKeybinds(deepCopy(updatedKeybinds))
  }

  const handleKeyDown = index => event => {
    const pressedKey = event.key.toUpperCase()
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
        style={{ ...textStyle(3, true), ...styles.settingHeader }}
      >
        Settings
      </Typography>

      <Box style={styles.keybindBody}>
        <Box style={styles.leftSide}>
          {newKeybinds.map(({ key }, index) => (
            <Button
              key={key}
              variant="outlined"
              style={styles.keybindButton}
              onKeyDown={handleKeyDown(index)}
              onClick={() => showAlert('Click a key to assign.', 'info')}
            >
              {key}
            </Button>
          ))}
        </Box>

        <Box style={styles.rightSide}>
          {keybinds.map(({ key, description }) => (
            <Box key={key} style={styles.keybindDescription}>
              <Typography
                variant="body2"
                style={textStyle(3, false, '#1976d2')}
              >
                {description}
              </Typography>
              <Button
                variant="outlined"
                style={styles.transparentButton}
              ></Button>
            </Box>
          ))}
        </Box>
      </Box>

      <Button
        variant="contained"
        onClick={handleSave}
        style={styles.saveButton}
        disabled={!isSaveVisible}
      >
        Save
      </Button>
    </Box>
  )
}

const styles = {
  container: {
    height: '100%',
    width: '100%',
    // backgroundColor: 'maroon', // CHANGE
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  settingHeader: {
    borderBottom: '2px solid #1976D2',
    width: '27%',
    marginHorizontal: 'auto',
    marginBottom: '20px',
  },
  keybindBody: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
    // backgroundColor: 'lightblue', // CHANGE
  },
  leftSide: {
    height: '100%',
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'pink', // CHANGE
    marginBottom: '20px',
  },
  rightSide: {
    height: '100%',
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'orange', // CHANGE
  },
  keybindButton: {
    fontWeight: 'bold',
    width: '30px',
    height: '30px',
    borderRadius: '5px',
    fontSize: '16px',
    marginBottom: '7px',
  },
  keybindDescription: {
    // backgroundColor: 'lightgrey', // CHANGE
    marginLeft: '20px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  transparentButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    width: '30px',
    height: '30px',
    borderRadius: '5px',
    fontSize: '16px',
    marginBottom: '7px',
  },
  saveButton: {
    marginTop: '20px',
    width: '150px',
    padding: '10px',
    zIndex: 1,
  },
}

export default SettingsTabContent
