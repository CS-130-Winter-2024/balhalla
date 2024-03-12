import { useState, useEffect } from 'react'
import {
  Modal,
  Fade,
  Paper,
  Box,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Button,
} from '@mui/material'
import PropTypes from 'prop-types'
import SettingsIcon from '@mui/icons-material/Settings'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import TabCarousel from './TabCarousel'
import TabInstructionsContent from './TabInstructionsContent'
import TabSettingsContent from './TabSettingsContent'
import AvatarSelector from './AvatarSelector'
import PlayerStats from './PlayerStats'

import backgroundImage from "../../assets/textures/Background.png"
import parchment from "../../assets/textures/Parchment.png"

const bgUrl = "url("+backgroundImage+")"
const parchUrl = "url("+parchment+")"

// modal constants
const WIDTH_PERCENT = '50%'
const HEIGHT_PERCENT = '65%'
const MIN_WIDTH = '400px'
const MIN_HEIGHT = '250px'
const SECOND_BLUE = 'lightgray' // "#35baf6"
const FIRST_BLUE = '#1976D2'

// functions for Text
function textStyle(size = 3, bolded = false) {
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
    '36px',
    '48px',
    '60px',
  ]

  return {
    color: 'white',
    fontFamily: 'Jorvik',
    textAlign: 'center',
    fontSize: fontSizeMapping[size],
    fontWeight: bolded ? 'bold' : 'normal',
  }
}

// prop validation
InGameMenu.propTypes = {
  handleClose: PropTypes.func.isRequired,
  inGame: PropTypes.bool.isRequired,
  showAlert: PropTypes.func.isRequired,
}

function InGameMenu({ handleClose,  showAlert }) {
  // conditions and states
  const [open, setOpen] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [menuHeight, setMenuHeight] = useState(window.innerHeight)

  // info states
  const [avatarName, setAvatarName] = useState('You')
  const [username, setUsername] = useState('GiangPappi')
  const [stats, setStats] = useState([])

  // useEffect to set default values based on endpoint
  useEffect(() => {
    setAvatarName('You')
    setUsername('GiangPappi')
    setStats([
      { key: 'Wins', value: '10' },
      { key: 'Losses', value: '90' },
      { key: 'Win Rate', value: '10%' },
      { key: 'Kills', value: '322' },
      { key: 'Rank', value: 'Diamond' },
      { key: 'Creation', value: '2022-03-08' },
    ])
  }, [])

  // if spacebar pressed, toggle the open state REMOVETHIS
  document.addEventListener('spaceBarPressed', () => {
    setOpen(!open)
    setMenuHeight(window.innerHeight)
    console.log('menuHeight: ', menuHeight)
  })

  return (
    <>
      <Modal open={open} onClose={handleClose} closeAfterTransition>
        <Fade in={open} timeout={{ enter: 500, exit: 300 }}>
          <Paper style={styles.customModal}>
            {/* Modal Header */}
            <Box style={styles.modalHeader}>
              <Typography style={textStyle(6, true)}>Menu</Typography>
            </Box>

            {/* Modal Body */}
            <Box style={styles.modalBody}>
              {/* Left Body */}
              <Box style={styles.leftBody}>
                <Box style={styles.leftTop}>
                  <AvatarSelector
                    initImageName={avatarName}
                    showAlert={showAlert}
                  />
                  <Typography style={textStyle(3, true)}>{username}</Typography>
                </Box>

                {/* Divider */}
                <Box style={styles.divider}></Box>

                <Box style={styles.leftBottom}>
                  <PlayerStats stats={stats} />
                </Box>
              </Box>

              {/* Right Body */}
              <Box style={styles.rightBody}>

                <Box style={styles.carousel}>
                  {carouselIndex == 0 && <TabSettingsContent showAlert={showAlert} /> || <TabInstructionsContent />}
                </Box>
                <Box style={styles.navigation}>
                  <Button style={styles.navigationButton} onClick={()=>{setCarouselIndex(0)}}>
                    <SettingsIcon style={{ fontSize: '42px', color:carouselIndex == 0 && "black" || "darkgray" }} />
                  </Button>
                  <Button style={styles.navigationButton} onClick={()=>{setCarouselIndex(1)}}>
                    <HelpOutlineIcon style={{ fontSize: '42px', color:carouselIndex == 1 && "black" || "darkgray"}} />
                  </Button>
                </Box>

              </Box>
            </Box>
          </Paper>
        </Fade>
      </Modal>
    </>
  )
}

const styles = {
  customModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    width: WIDTH_PERCENT,
    height: HEIGHT_PERCENT,
    backgroundImage:bgUrl,
    backgroundRepeat:"no-repeat",
    backgroundSize:"cover",
    outline: 0,
    padding: '20px',
    display: 'flex',
    borderRadius: '20px',
    border: '5px solid black',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderBottom: "1px solid white",
  },
  modalBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    flexDirection: 'row',
    flex:9,
    zIndex: 1,
  },
  leftBody: {
    display: 'flex',
    flex:1,
    flexDirection:'column',
  },

  rightBody: {
    display: 'flex',
    flexDirection: 'column',
    flex:1,
    backgroundImage:parchUrl,
    backgroundRepeat:'no-repeat',
    backgroundSize:'100% 100%',
    backgroundPosition: 'center',
  },
  leftTop: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '50%',
    // backgroundColor: 'purple', // CHANGE
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '-3px', // this is account for the divider
  },
  leftBottom: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flex:1,
  },
  carousel: {
    display: 'flex',
    flex: 4,
    padding:10,
    margin:"25px 15px 0 15px"
  },
  navigation: {
    display: 'flex',
    flex:1,
    margin:"0 15px 15px 15px",
    flexDirection:"row",
    justifyContent:"space-around"
  },
  navigationButton : {
    borderRadius:"60px", 
    outline:"none",
  },
  bottomNavigation: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    maxHeight: '75px',
  },
  divider: {
    width: '80%',
    borderBottom: `3px solid ${SECOND_BLUE}`,
    margin: 'auto',
  },
}

export default InGameMenu
