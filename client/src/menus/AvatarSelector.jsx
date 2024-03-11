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

import gojo from '../../assets/images/gojo_pfp.jpg'
import aot from '../../assets/images/aot_pfp.jpg'
import sukuna from '../../assets/images/sukuna_pfp.jpg'
import thorfinn from '../../assets/images/thorfinn_pfp.jpg'
import goku from '../../assets/images/goku_pfp.jpg'

// Sample image options (you can replace these with your image URLs)

const imageOptions = [
  gojo,
  aot,
  sukuna,
  thorfinn,
  goku,
]

const descriptionMap = ['Gojo', 'You', 'Kevin Nguyen', "No Enemies", "Goku"]

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
  showAlert: PropTypes.func.isRequired,
}

function AvatarSelector({ initImageName = 'Gus', showAlert }) {
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
    showAlert('Profile picture saved!', 'success')
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

export default AvatarSelector
