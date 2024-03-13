import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { add_listener, remove_listener } from '../../constants'
import backgroundImage from "../../../assets/textures/Background.png"
const bgUrl = "url("+backgroundImage+")";

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
    fontFamily: 'Roboto, Helvetica, Arial',
    textAlign: 'center',
    fontSize: fontSizeMapping[size],
    fontWeight: bolded ? 'bold' : 'normal',
  }
}


// set onclose to () => setOpen(false) for it close in parent component
const EndScreen = ({ winnerText = 'Blue Team Wins', onClose }) => {
  const [visible, setVisible] = useState(false)

  useEffect(()=>{
    let listener = add_listener("GAME_OVER",()=>{
      setVisible(true);
    })
    return ()=>{remove_listener("GAME_OVER",listener)};
  })

  return (
    <Dialog
      open={visible}
      onClose={()=>{setVisible(false)}}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          maxHeight: '50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
        },
      }}
    >
      <DialogTitle>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          style={{ position: 'absolute', right: 20, top: 5 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundImage: bgUrl,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          style={{
            display: 'flex',
            width: '100%',
            backgroundColor: 'transparent',
            color: '#1976d2',
            justifyContent: 'center',
            ...textStyle(5, true),
            textDecoration: 'underline',
          }}
        >
          {winnerText}
        </Typography>
        <Box
          style={{
            minHeight: '200px',
            backgroundColor: 'transparent',
            width: '100%',
          }}
        >
          {/* Add your own content here evan*/}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

EndScreen.propTypes = {
  open: PropTypes.bool.isRequired,
  winnerText: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default EndScreen
