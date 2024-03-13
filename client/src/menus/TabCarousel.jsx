import { Paper } from '@mui/material'
import PropTypes from 'prop-types'
import SettingsTabContent from './TabSettingsContent'
import TabInstructionsContent from './TabInstructionsContent'

TabCarousel.propTypes = {
  index: PropTypes.number.isRequired,
  menuHeight: PropTypes.number.isRequired,
  showAlert: PropTypes.func.isRequired,
}

const INSTRUCTIONS = `
  Welcome to the game! Here are the instructions:\n
  1. Use the arrow keys to move the character\n
  2. Collect the coins to earn points\n
  3. Avoid the balls\n
  4. Throw your balls\n
  5. Make sure you hit your ops with your balls\n
  6. Buy skins so we can make money\n
`

function TabCarousel({ index, menuHeight, showAlert }) {
  const styles = {
    container: {
      height: '100%',
      width: '100%',
      // backgroundColor: 'maroon', // CHANGE
      flex: 1,
      position: 'relative',
    },
  }

  return (
    <Paper style={styles.container}>
    {false && 
        (<SettingsTabContent height={menuHeight} showAlert={showAlert} />)
    }

    {false && <TabInstructionsContent height={menuHeight} text={INSTRUCTIONS} />}
    </Paper>
  )
}

export default TabCarousel
