import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Avatar,
  Button,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useState } from 'react'
import {
  add_listener,
  remove_listener,
  get_global,
  TEXTURES,
  AVATARS,
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
  const [points_earned, setPoints] = useState(get_global('INDIVIDUAL_SCORE') || 0)
  const [mvp, setMvp] = useState(get_global('MVP_DATA') || {})


  // delete these two and replace with the two on top once you verify the other two on top works (i have no idea, couldnt test)
  // not sure how metadata suppose to look, but from other code i assume .username .team .hits
  //const [mvp, setMvp] = useState(get_global("MVP"))
  //const [points_earned, setPoints] = useState(get_global("EARNED_POINTS") || 0)

  useEffect(() => {
    let listener = add_listener('GAME_OVER', x => {
      if (!x) return
      setVisible(true)
      if (get_global('WINNER') == 1) {
        setWinner('Red Team Wins')
      } else if (get_global('WINNER') == 2) {
        setWinner('Tied Match')
      }
      setMvp(get_global('MVP_DATA'));
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
          width: '40%',
          borderRadius: 15,
          boxShadow: '0px 15px 30px 15px #000000',
          elevation: 5,
        },
      }}
    >
      <DialogContent
        style={{
          display: 'flex',
          alignItems: 'stretch',
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
        <Box
          flex={4}
          style={{ display: 'flex', flexDirection:"column", alignItems: 'stretch' }}
        >
          <Box flex={1} display={"flex"} justifyContent={"center"} flexDirection={"row"} alignItems={"center"}>
            <Box flexShrink={1} flexBasis={150} display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"}>
              <Typography style={{ ...textStyle(5, true), color: '#b29146', zIndex:1, width:"100%", textAlign:"center" }}>
                MVP
              </Typography>
              <Box style={{ position: 'relative', marginTop: 5 }}>
                <img
                  src={axe}
                  alt="Cross Axes"
                  style={{
                    position: 'absolute',
                    height: '200%',
                    objectFit: 'contain',
                    transform: 'translate(-25%, -25%)',
                    elevation: 5,
                  }}
                />
                <Avatar
                  src={(mvp && mvp.icon) ? AVATARS[mvp.icon] : AVATARS[0]}
                  alt="Profile Avatar"
                  sx={{
                    ...styles.avatarImage,
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: '0px 0px 20px 0px #000000',
                  }}
                />
              </Box>
              <Typography style={{ ...textStyle(5, true), zIndex:1, color: '#ffffff' }}>
                {(mvp && mvp.username) || "Nobody"}
              </Typography>
            </Box>
            <Box flexShrink={1} flexBasis={100} display={"flex"} alignItems={"stretch"} justifyContent={"center"} flexDirection={"column"}>
              <Typography
                style={{
                  ...textStyle(4, false),
                  color: '#9c9c9c',
                  wordSpacing: '0.2em',
                  textAlign: 'center',
                }}
              >
                {(mvp && mvp.hits) || 0} KILL{(mvp && mvp.hits > 1 && "") || "S"}
              </Typography>
            </Box>
            {points_earned != 0 && <Box flexBasis={250} display={"flex"} flexDirection={"column"} justifyContent={"space-around"} alignItems={"stretch"}>
              <Typography
                style={{
                  ...textStyle(4, false),
                  color: '#9c9c9c',
                  wordSpacing: '0.2em',
                  textAlign: 'center',
                }}
              >
                You earned {points_earned} points!
              </Typography>
              <Typography
                style={{
                  ...textStyle(4, false),
                  color: '#9c9c9c',
                  wordSpacing: '0.2em',
                  textAlign: 'center',
                }}
              >
                You have a grand total of {get_global("POINTS") || points_earned} points!
              </Typography>
            </Box>}
          </Box>

          <Box
            flex={2}
            alignItems={"center"}
            justifyContent={"center"}
            display={"flex"}
          >
            <Button variant="outlined"
              style={{
                fontFamily: 'Jorvik',
                backgroundColor: 'white',
                color: 'black',
                fontSize:"22px",
                zIndex:1,
              }} 
              onClick={()=>{setVisible(false)}}>
                OK
            </Button>
          </Box>
          
        </Box>
        <img
          src={fire}
          alt="Fire Image"
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '25%',
            opacity: 0.45,
            left:0,
            zIndex:0,
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

const styles = {
  avatarImage: {
    width: 100,
    height: 100,
    border: '4px solid black',
  },
}

export default EndScreen
