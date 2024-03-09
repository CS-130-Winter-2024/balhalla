import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Typography,
  Grid,
  useTheme,
} from '@mui/material'
import PropTypes from 'prop-types'

// Sample image options (you can replace these with your image URLs)
const imageOptions = [
  'https://cdn.discordapp.com/attachments/371115539365494794/1216003698887757834/image.png?ex=65feceb2&is=65ec59b2&hm=30ff98c6839e422ba8396b14394e47cc44d7a6196d8e870d6916f1a48d0fdd48&',
  'https://cdn.discordapp.com/attachments/371115539365494794/1216003940324475010/image.png?ex=65feceeb&is=65ec59eb&hm=3fa574f77a1a6ea9c26c51734d9b219e6ca5786a8e9bce169a7cac6034a49edc&',
  'https://cdn.discordapp.com/attachments/371115539365494794/1216004308143968357/image.png?ex=65fecf43&is=65ec5a43&hm=e0bc3fb6968fd977819d4aa3ffdd00cdffe284429fe6ebd7a483813e449e8adb&',
]

const descriptionMap = ['Am', 'Mo', 'Gus']

const styles = {
  avatarButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  avatarImage: {
    width: 135,
    height: 135,
    border: '4px solid black',
  },
  avatarOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: 1,
    padding: 1,
  },
}

// prop validation
AvatarSelector.propTypes = {
  initImageName: PropTypes.string.isRequired,
}

function AvatarSelector({ initImageName = 'Gus' }) {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(
    descriptionMap.indexOf(initImageName) !== -1
      ? imageOptions[descriptionMap.indexOf(initImageName)]
      : initImageName,
  )
  const [newAvatar, setNewAvatar] = useState(`${selectedAvatar}`)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = () => {
    setSelectedAvatar(newAvatar)
    setOpen(false)
  }

  const handleImageClick = imageUrl => {
    setNewAvatar(imageUrl)
  }

  return (
    <Box>
      <Tooltip title="Change Avatar">
        <IconButton onClick={handleOpen} sx={styles.avatarButton}>
          <Avatar
            src={selectedAvatar}
            alt="Profile Avatar"
            sx={styles.avatarImage}
          />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select Profile Picture</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {imageOptions.map(imageUrl => (
              <Grid item key={imageUrl}>
                <Box
                  sx={{
                    ...styles.avatarOption,
                    border: `3px solid ${imageUrl === newAvatar ? theme.palette.primary.main : 'transparent'}`,
                  }}
                  onClick={() => handleImageClick(imageUrl)}
                >
                  <Avatar
                    src={imageUrl}
                    alt="Profile Option"
                    sx={{ width: 120, height: 120, marginBottom: 1 }}
                  />
                  <Typography variant="caption">
                    {descriptionMap[imageOptions.indexOf(imageUrl)]}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" disabled={!newAvatar}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AvatarSelector;