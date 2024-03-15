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
} from '@mui/material'
import PropTypes from 'prop-types'
import { AVATARS, AVATAR_NAMES, get_global, set_global } from '../../constants'

//import

import bg from '../../../assets/textures/Background.png'
const bgUrl = 'url(' + bg + ')'

// Sample image options (you can replace these with your image URLs)

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
  background: {
    backgroundImage: bgUrl,
    backgroundSize: '100% 100%',
  },
  actionButton: {
    color: 'white',
    fontFamily: 'Jorvik',
    fontSize: '18px',
  },
  captionText: {
    color: 'white',
    fontFamily: 'Jorvik',
    fontSize: '16px',
  },
}

// prop validation
AvatarSelector.propTypes = {
  initImageName: PropTypes.string.isRequired,
  showAlert: PropTypes.func.isRequired,
}

/**
 * A component for selecting and changing the user's avatar.
 * @param {Object} props - The props object containing showAlert and canClick properties.
 * @param {Function} props.showAlert - Function to display alerts.
 * @param {boolean} props.canClick - Flag indicating if the component is clickable.
 */
function AvatarSelector({ showAlert, canClick }) {
  const [open, setOpen] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(get_global('ICON') || 0)
  const [newAvatar, setNewAvatar] = useState(AVATARS[get_global('ICON') || 0])

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = () => {
    setSelectedAvatar(newAvatar)
    set_global('ICON', newAvatar)
    setOpen(false)
    showAlert('Profile picture saved!', 'success')

    if (!localStorage.getItem('token')) return //shouldnt happen
    fetch('/update_items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: localStorage.getItem('token'),
        ball: get_global('BALL') || 2,
        pet: get_global('PET'),
        icon: get_global('ICON'),
      }),
    })
  }

  const handleImageClick = imageUrl => {
    setNewAvatar(imageUrl)
  }

  return (
    <Box>
      <Tooltip title="Change Avatar">
        <IconButton
          onClick={handleOpen}
          disabled={!canClick}
          sx={styles.avatarButton}
        >
          <Avatar
            src={AVATARS[selectedAvatar]}
            alt="Profile Avatar"
            sx={styles.avatarImage}
          />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle
          style={{
            textAlign: 'center',
            backgroundImage: bgUrl,
            color: 'white',
            borderBottom: '3px solid white',
            fontFamily: 'Jorvik',
            fontSize: '26px',
          }}
        >
          Select Profile Picture
        </DialogTitle>
        <DialogContent sx={styles.background}>
          <Grid container spacing={2}>
            {AVATARS.map((imageUrl, index) => (
              <Grid item key={imageUrl}>
                <Box
                  sx={{
                    ...styles.avatarOption,
                    border: `3px solid ${index === newAvatar ? 'white' : 'transparent'}`,
                  }}
                  onClick={() => handleImageClick(index)}
                >
                  <Avatar
                    src={imageUrl}
                    alt="Profile Option"
                    sx={{ width: 100, height: 100, marginBottom: 1 }}
                  />
                  <Typography variant="caption" style={styles.captionText}>
                    {AVATAR_NAMES[index]}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions
          style={{ backgroundImage: bgUrl, borderTop: '3px solid white' }}
        >
          <Button onClick={handleClose} style={styles.actionButton}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            style={styles.actionButton}
            disabled={!newAvatar}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AvatarSelector
