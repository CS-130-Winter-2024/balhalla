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
import { add_listener, remove_listener, get_global } from '../../constants'
import backgroundImage from '../../../assets/textures/Background.png'
const bgUrl = 'url(' + backgroundImage + ')'

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
    fontFamily: 'Jorvik',
    textAlign: 'center',
    fontSize: fontSizeMapping[size],
    fontWeight: bolded ? 'bold' : 'normal',
  }
}

// set onclose to () => setOpen(false) for it close in parent component
const EndScreen = ({ onClose }) => {
  const [visible, setVisible] = useState(false)

  const [winner, setWinner] = useState('Blue Team Wins')
  const [points_earned, setPoints] = useState(get_global('POINTS') || 0)
  const [mvp, setMvp] = useState(get_global('MVP'))

  useEffect(() => {
    let listener = add_listener('GAME_OVER', x => {
      if (!x) return
      setVisible(true)
      if (get_global('WINNER') == 1) {
        setWinner('Red Team Wins')
      } else if (get_global('WINNER') == 2) {
        setWinner('Tied Match')
      }
    })

    let close_lisenter = add_listener('SPECTATING', x => {
      setVisible(false)
    })
    return () => {
      remove_listener('GAME_OVER', listener)
    }
  })

  return (
    <Dialog
      open={visible}
      onClose={() => {
        setVisible(false)
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          maxHeight: '50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '60%',
        },
      }}
    >
      <DialogContent
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundImage: bgUrl,
          backgroundSize: '100% 100%',
        }}
      >
        <Box flex={1} flexDirection={'row'}>
          <Box flex={1}></Box>
          <Box flex={1} justifyContent={'center'}>
            <Typography
              variant="h4"
              gutterBottom
              style={{
                display: 'flex',
                width: '100%',
                backgroundColor: 'transparent',
                color: 'white',
                justifyContent: 'center',
                ...textStyle(5, true),
                textDecoration: 'underline',
              }}
            >
              {winner}
            </Typography>
          </Box>
          <Box flex={1} justifyContent={'center'}>
            <IconButton
              edge="end"
              color="white"
              onClick={() => {
                setVisible(false)
              }}
              aria-label="close"
              style={{ position: 'absolute', right: 20, top: 5 }}
            >
              <CloseIcon color="white" />
            </IconButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default EndScreen
