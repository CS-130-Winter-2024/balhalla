import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Avatar,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useState } from 'react'
import {
  add_listener,
  remove_listener,
  get_global,
  TEXTURES,
} from '../../constants'
import { getMetadataByPlayerID } from '../../game/OtherPlayers'
import axe from '../../../assets/images/sword_cross.png'
import fire from '../../../assets/images/fire.gif'
const bgUrl = 'url(' + TEXTURES.stone + ')'

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

const EndScreen = ({}) => {
  const [visible, setVisible] = useState(false)

  const [winner, setWinner] = useState('Blue Team Wins')
  // const [points_earned, setPoints] = useState(get_global('POINTS') || 0)
  // const [mvp, setMvp] = useState(getMetadataByPlayerID(get_global('MVP')))

  // delete these two and replace with the two on top once you verify the other two on top works (i have no idea, couldnt test)
  // not sure how metadata suppose to look, but from other code i assume .username .team .hits
  const RANDOM_PFP = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy2OsULDI7DDc53-rV7c9NG2bHVCrd6LcF2A&usqp=CAU'
  const [mvp, setMvp] = useState({ username: 'bob', hits: 101, team: 'blue' })
  const [points_earned, setPoints] = useState(123)

  useEffect(() => {
    let listener = add_listener('GAME_OVER', x => {
      if (!x) return
      setVisible(false)
      if (get_global('WINNER') == 1) {
        setWinner('Red Team Wins')
      } else if (get_global('WINNER') == 2) {
        setWinner('Tied Match')
      }
    })

    let closeListener = add_listener('SPECTATING', x => {
      setVisible(false)
    })
    return () => {
      remove_listener('GAME_OVER', listener)
      remove_listener('SPECTATING', closeListener)
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
          height: '50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '30%',
          borderRadius: 15,
          boxShadow: '0px 15px 30px 15px #000000',
          elevation: 5,
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
        <Box flex={1 / 5} flexDirection={'row'}>
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
              onClick={() => {
                setVisible(false)
              }}
              aria-label="close"
              style={{ position: 'absolute', right: 20, top: 5 }}
            >
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Box>
        <Box></Box>
        <Box
          flex={4 / 5}
          style={{ display: 'flex', marginBottom: 40, alignItems: 'center' }}
        >
          <Typography
            style={{
              ...textStyle(4, false),
              color: '#9c9c9c',
              wordSpacing: '0.2em',
              textAlign: 'center',
              marginRight: 45,
            }}
          >
            {points_earned} POINTS
          </Typography>
          <Box
            flexDirection={'column'}
            sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}
          >
            <Typography style={{ ...textStyle(5, true), color: '#b29146' }}>
              MVP
            </Typography>
            <Box style={{ position: 'relative', marginTop: 5 }}>
              <img
                src={axe}
                alt="Cross Axes"
                style={{
                  position: 'absolute',
                  width: '175%',
                  height: '175%',
                  objectFit: 'cover',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  elevation: 5,
                }}
              />
              <Avatar
                src={
                  RANDOM_PFP
                }
                alt="Profile Avatar"
                sx={{
                  ...styles.avatarImage,
                  position: 'relative',
                  zIndex: 1,
                  boxShadow: '0px 0px 20px 0px #000000',
                }}
              />
            </Box>
            <Typography style={{ ...textStyle(5, true), color: '#b29146' }}>
              {mvp.username}
            </Typography>
          </Box>
          <Typography
            style={{
              ...textStyle(4, false),
              color: '#9c9c9c',
              wordSpacing: '0.2em',
              textAlign: 'center',
              marginLeft: 45,
            }}
          >
            {mvp.hits} KILLS
          </Typography>
        </Box>
        <img
          src={fire}
          alt="Fire Animation"
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '25%',
            opacity: 0.45,
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

const styles = {
  avatarImage: {
    width: 150,
    height: 150,
    border: '4px solid black',
  },
}

export default EndScreen
