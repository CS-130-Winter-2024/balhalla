import { Typography, Box } from '@mui/material'
import PropTypes from 'prop-types'

TabInstructionsContent.propTypes = {
  text: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
}

const INSTRUCTIONS = `
  Press the Throw key to throw your weapon\n
  If you hit a player, you gain points that you can buy skins with\n
  Pick up weapons on the ground to be able to throw again\n
  When you are hit, you turn into a ghost that can push weapons around`

function TabInstructionsContent({}) {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',

      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    header: {
      ...textStyle(3, true),
      borderBottom: '2px solid black',
      display:"flex",
      flex:1,
    },
    content: {
      ...textStyle(2),
      display: "flex",
      flex:9,
      whiteSpace: 'pre-line',
      lineHeight: '1',
    },
  }

  const renderTextWithBold = () => {
    const parts = INSTRUCTIONS.split(/(\{[^}]*\})/)
    return parts.map((part, index) => {
      if (index % 2 === 0) {
        // Regular text
        return <span key={index}>{part}</span>
      } else {
        // Bolded text
        return (
          <span key={index} style={{ fontWeight: 'bold' }}>
            {part}
          </span>
        )
      }
    })
  }

  return (
    <Box style={styles.container}>
      <Typography variant="h5" style={styles.header}>
        Instructions
      </Typography>
      <Typography variant="body1" style={styles.content}>
        {INSTRUCTIONS}
      </Typography>
    </Box>
  )
}

function textStyle(size = 3, bolded = false, color = 'black') {
  if (size < 0 || size > 6) {
    console.error('Invalid size for textStyle')
    return
  }
  const fontSizeMapping = [
    '16px',
    '18px',
    '20px',
    '24px',
    '32px',
    '40px',
  ]

  return {
    color: color,
    fontFamily: 'Jorvik',
    textAlign: 'center',
    fontSize: fontSizeMapping[size],
    fontWeight: bolded ? 'bold' : 'normal',
  }
}

export default TabInstructionsContent
